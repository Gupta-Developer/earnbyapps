import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../auth/[...nextauth]/route';
import { sql } from '../../../../../../lib/db';
import { signToken } from '../../../../../../lib/jwt';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      console.error('Mobile Google Auth: No session found');
      // If we don't have a session, we redirect to mobile deep link with failure
      const redirectUrl = `earnbyapps://auth?success=false&error=no_session`;
      return NextResponse.redirect(redirectUrl);
    }

    const email = session.user.email.toLowerCase();
    const name = session.user.name || 'Google User';

    // Check if the user exists in database
    let users = await sql`SELECT * FROM users WHERE email = ${email}`;
    let user;

    if (users.length === 0) {
      // Register user
      const role = email === 'admin@earnbyapps.com' || email === 'mayank.gupta.dev.1@gmail.com' || email === 'aashish.gupta.mails@gmail.com' ? 'admin' : 'user';
      
      await sql`
        INSERT INTO users (email, full_name, role, balance)
        VALUES (${email}, ${name}, ${role}, 100.00)
      `;
      
      users = await sql`SELECT * FROM users WHERE email = ${email}`;
    }

    user = users[0];

    // Sign the JWT token for the mobile app
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Deep link back to the mobile app
    const redirectUrl = `earnbyapps://auth?token=${token}&success=true`;
    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    console.error('Mobile Google Auth Callback Error:', error);
    const redirectUrl = `earnbyapps://auth?success=false&error=${encodeURIComponent(error.message || 'auth_error')}`;
    return NextResponse.redirect(redirectUrl);
  }
}
