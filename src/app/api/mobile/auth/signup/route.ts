import { NextResponse } from 'next/server';
import { sql } from '../../../../../lib/db';
import { signToken } from '../../../../../lib/jwt';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName, role, originAppId } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'Email, Password and Full Name are required.' }, { status: 400 });
    }

    // Ensure database table has the required columns
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255)`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS origin_app_id VARCHAR(100) DEFAULT 'main'`;
    } catch (migErr) {
      console.warn("Migration warning for users columns:", migErr);
    }

    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existing = await sql`SELECT * FROM users WHERE email = ${normalizedEmail}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: 'User with this email already exists.' }, { status: 400 });
    }

    // Hash the password using SHA-256
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Assign appropriate role based on user selection or hardcoded email check
    let assignedRole = 'user'; // default (Earner)
    
    if (normalizedEmail === 'admin@earnbyapps.com' || normalizedEmail === 'mayank.gupta.dev.1@gmail.com' || normalizedEmail === 'aashish.gupta.mails@gmail.com') {
      assignedRole = 'admin';
    } else if (role === 'partner') {
      assignedRole = 'partner';
    }

    const newId = crypto.randomUUID();
    const finalOriginAppId = originAppId || 'main';
    const result = await sql`
      INSERT INTO users (id, email, password, full_name, role, balance, origin_app_id)
      VALUES (${newId}, ${normalizedEmail}, ${hashedPassword}, ${fullName}, ${assignedRole}, 100.00, ${finalOriginAppId})
      RETURNING id, email, full_name as "fullName", role, balance, origin_app_id as "originAppId"
    `;

    const newUser = result[0];

    // Generate JWT token
    const token = signToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    return NextResponse.json({
      success: true,
      message: 'User registered successfully!',
      token,
      user: {
        id: String(newUser.id),
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        balance: Number(newUser.balance),
        originAppId: newUser.originAppId
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Mobile Registration API Error:', error);
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
