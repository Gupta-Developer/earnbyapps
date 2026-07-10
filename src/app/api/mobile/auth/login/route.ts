import { NextResponse } from 'next/server';
import { sql } from '../../../../../lib/db';
import { signToken } from '../../../../../lib/jwt';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, deviceId } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    // Ensure database table has the password column
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255)`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS device_id VARCHAR(255)`;
    } catch (migErr) {
      console.warn("Migration warning for columns:", migErr);
    }

    // Find user by email
    const users = await sql`SELECT * FROM users WHERE email = ${email.toLowerCase()}`;
    if (users.length === 0) {
      return NextResponse.json({ error: 'No user found with this email.' }, { status: 401 });
    }

    const user = users[0];
    if (user.is_blocked) {
      return NextResponse.json({ error: 'Your account has been blocked. Please contact support.' }, { status: 403 });
    }
    if (!user.password) {
      return NextResponse.json({ error: 'This account is configured with Google Sign In on web.' }, { status: 400 });
    }

    // Hash incoming password using SHA-256
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    if (hashedPassword !== user.password) {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
    }

    // Associate device_id if not already set for this user, and ensure it's not linked to another account
    if (deviceId) {
      const deviceCheck = await sql`SELECT email FROM users WHERE device_id = ${deviceId} AND id != ${user.id}`;
      if (deviceCheck.length > 0) {
        const registeredEmail = deviceCheck[0].email;
        const [localPart, domainPart] = registeredEmail.split('@');
        const maskedLocal = localPart.length > 2 
          ? localPart.substring(0, 2) + '*'.repeat(localPart.length - 2) 
          : localPart + '***';
        const maskedEmail = `${maskedLocal}@${domainPart}`;
        return NextResponse.json({ 
          error: `This device is already registered with the email: ${maskedEmail}` 
        }, { status: 400 });
      }

      if (!user.device_id) {
        await sql`UPDATE users SET device_id = ${deviceId} WHERE id = ${user.id}`;
        user.device_id = deviceId;
      }
    }

    // Sign the JWT token
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: String(user.id),
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        balance: Number(user.balance || 0.00)
      }
    });
  } catch (error: any) {
    console.error('Mobile Login API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
