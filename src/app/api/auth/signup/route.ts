import { NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName, role } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'Email, Password and Full Name are required.' }, { status: 400 });
    }

    // Ensure database table has the password column
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255)`;
    } catch (migErr) {
      console.warn("Migration warning for password column:", migErr);
    }

    // Check if user already exists
    const existing = await sql`SELECT * FROM users WHERE email = ${email.toLowerCase()}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: 'User with this email already exists.' }, { status: 400 });
    }

    // Hash the password using SHA-256
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Assign appropriate role based on user selection or hardcoded email check
    let assignedRole = 'user'; // default (Earner)
    const normalizedEmail = email.toLowerCase();
    
    if (normalizedEmail === 'admin@earnbyapps.com' || normalizedEmail === 'mayank.gupta.dev.1@gmail.com' || normalizedEmail === 'aashish.gupta.mails@gmail.com') {
      assignedRole = 'admin';
    } else if (role === 'partner') {
      assignedRole = 'partner';
    }

    const newId = crypto.randomUUID();
    await sql`
      INSERT INTO users (id, email, password, full_name, role, balance)
      VALUES (${newId}, ${normalizedEmail}, ${hashedPassword}, ${fullName}, ${assignedRole}, 0.00)
    `;

    return NextResponse.json({ success: true, message: 'User registered successfully!' });
  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
