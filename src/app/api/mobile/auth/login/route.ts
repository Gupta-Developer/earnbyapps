import { NextResponse } from 'next/server';
import { sql } from '../../../../../lib/db';
import { signToken } from '../../../../../lib/jwt';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    // Ensure database table has the password column
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255)`;
    } catch (migErr) {
      console.warn("Migration warning for password column:", migErr);
    }

    // Find user by email
    const users = await sql`SELECT * FROM users WHERE email = ${email.toLowerCase()}`;
    if (users.length === 0) {
      return NextResponse.json({ error: 'No user found with this email.' }, { status: 401 });
    }

    const user = users[0];
    if (!user.password) {
      return NextResponse.json({ error: 'This account is configured with Google Sign In on web.' }, { status: 400 });
    }

    // Hash incoming password using SHA-256
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    if (hashedPassword !== user.password) {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
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
