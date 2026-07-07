import { NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';
import { getAuthenticatedUser } from '../../../../lib/authHelper';

export async function GET(request: Request) {
  try {
    const authUser = getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized. Please login.' }, { status: 401 });
    }

    // Retrieve user record from database
    const users = await sql`
      SELECT id, email, full_name as "fullName", phone, gender, country, role, balance, payment_method as "paymentMethod", payment_details as "paymentDetails", created_at
      FROM users
      WHERE email = ${authUser.email}
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const dbUser = users[0];

    // Count tasks completed from submissions
    const submissionCountRes = await sql`
      SELECT COUNT(*) as count 
      FROM submissions 
      WHERE user_email = ${dbUser.email}
    `;
    const tasksDoneCount = parseInt(submissionCountRes[0]?.count || '0');

    const approvedSubmissions = await sql`
      SELECT COUNT(*) as count 
      FROM submissions 
      WHERE user_email = ${dbUser.email} AND status = 'Approved'
    `;
    const approvedCount = parseInt(approvedSubmissions[0]?.count || '0');

    return NextResponse.json({
      success: true,
      profile: {
        id: String(dbUser.id),
        email: dbUser.email,
        fullName: dbUser.fullName,
        phone: dbUser.phone || '',
        gender: dbUser.gender || '',
        country: dbUser.country || 'India',
        role: dbUser.role,
        balance: Number(dbUser.balance || 0.00),
        paymentMethod: dbUser.paymentMethod || '',
        paymentDetails: dbUser.paymentDetails || '',
        tasksDone: tasksDoneCount,
        approvedTasks: approvedCount,
        createdAt: dbUser.created_at
      }
    });
  } catch (error: any) {
    console.error('Error fetching mobile profile:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authUser = getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized. Please login.' }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, phone, gender, country, paymentMethod, paymentDetails } = body;

    // Retrieve original record
    const existing = await sql`SELECT * FROM users WHERE email = ${authUser.email}`;
    if (existing.length === 0) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const current = existing[0];
    const newName = fullName !== undefined ? fullName : current.full_name;
    const newPhone = phone !== undefined ? phone : current.phone;
    const newGender = gender !== undefined ? gender : current.gender;
    const newCountry = country !== undefined ? country : current.country;
    const newPaymentMethod = paymentMethod !== undefined ? paymentMethod : current.payment_method;
    const newPaymentDetails = paymentDetails !== undefined ? paymentDetails : current.payment_details;

    await sql`
      UPDATE users 
      SET 
        full_name = ${newName}, 
        phone = ${newPhone}, 
        gender = ${newGender}, 
        country = ${newCountry},
        payment_method = ${newPaymentMethod}, 
        payment_details = ${newPaymentDetails}
      WHERE email = ${authUser.email}
    `;

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: authUser.id,
        email: authUser.email,
        fullName: newName,
        phone: newPhone,
        gender: newGender,
        country: newCountry,
        paymentMethod: newPaymentMethod,
        paymentDetails: newPaymentDetails
      }
    });
  } catch (error: any) {
    console.error('Error updating mobile profile:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
