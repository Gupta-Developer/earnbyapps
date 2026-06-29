import { NextResponse } from 'next/server';
import { sql } from '../../../lib/db';

export async function GET() {
  try {
    const users = await sql`
      SELECT id, email, full_name, phone, gender, country, role, balance, payment_method, payment_details, created_at 
      FROM users 
      ORDER BY created_at DESC
    `;

    const formattedUsers = users.map(u => ({
      id: String(u.id),
      name: u.full_name,
      email: u.email,
      phone: u.phone || 'N/A',
      upi: u.payment_details || 'N/A',
      country: u.country || 'India',
      tasksDone: 0, // Mock completed tasks count or we can count from submissions
      lastLogin: u.created_at ? new Date(u.created_at).toLocaleString() : 'N/A',
      role: u.role === 'admin' ? 'Admin' : (u.role === 'partner' ? 'Partner' : 'Earner'),
      balance: Number(u.balance || 0.00)
    }));

    return NextResponse.json(formattedUsers);
  } catch (error: any) {
    console.error('Error fetching users from Neon PostgreSQL database:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, adjustAmount } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const amt = parseFloat(adjustAmount);
    if (isNaN(amt)) {
      return NextResponse.json({ error: 'Valid adjustment amount is required' }, { status: 400 });
    }

    // Update the balance directly in the database
    await sql`
      UPDATE users 
      SET balance = balance + ${amt} 
      WHERE id = ${parseInt(userId)}
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error adjusting user balance in database:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
