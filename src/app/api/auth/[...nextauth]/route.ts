import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { sql } from "../../../../lib/db";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (user && user.email) {
        try {
          // Check if the user exists in our neon database users table
          const existingUsers = await sql`SELECT * FROM users WHERE email = ${user.email}`;
          if (existingUsers.length === 0) {
            // User doesn't exist, insert them!
            const fullName = user.name || 'Google User';
            const role = user.email === 'admin@earnbyapps.com' || user.email === 'mayank.gupta.dev.1@gmail.com' ? 'admin' : 'user';
            
            await sql`
              INSERT INTO users (email, full_name, role, balance)
              VALUES (${user.email}, ${fullName}, ${role}, 100.00)
            `;
            console.log(`Successfully registered new user via Google: ${user.email}`);
          }
        } catch (err) {
          console.error("Error saving user to database during Google Sign In:", err);
          // Return true anyway so sign in succeeds even if DB insert fails
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        try {
          const dbUsers = await sql`SELECT role, balance FROM users WHERE email = ${session.user.email}`;
          if (dbUsers.length > 0) {
            (session.user as any).role = dbUsers[0].role;
            (session.user as any).balance = Number(dbUsers[0].balance);
          } else {
            const isAdmin = session.user.email === 'admin@earnbyapps.com' || session.user.email === 'mayank.gupta.dev.1@gmail.com';
            (session.user as any).role = isAdmin ? 'admin' : 'user';
          }
        } catch (err) {
          console.error("Error retrieving user session role from database:", err);
          const isAdmin = session.user.email === 'admin@earnbyapps.com' || session.user.email === 'mayank.gupta.dev.1@gmail.com';
          (session.user as any).role = isAdmin ? 'admin' : 'user';
        }
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
