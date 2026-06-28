import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // Set role based on email - if it matches admin, they are admin, otherwise user
        const isAdmin = session.user.email === 'admin@earnbyapps.com' || session.user.email === 'mayank.gupta.dev.1@gmail.com'; // Adding the developer's email as admin for testing
        (session.user as any).role = isAdmin ? 'admin' : 'user';
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
