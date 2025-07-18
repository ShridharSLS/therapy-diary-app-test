import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'admin' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // This is where you would normally look up the user from a database
        // For this demo, we'll use hardcoded credentials
        const adminUser = {
          username: process.env.ADMIN_USERNAME || 'admin',
          password: process.env.ADMIN_PASSWORD || 'password',
        };

        if (credentials?.username === adminUser.username && credentials?.password === adminUser.password) {
          // Any object returned will be saved in `user` property of the JWT
          return { id: '1', name: 'Admin', email: 'admin@example.com' };
        } else {
          // If you return null then an error will be displayed
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
});

export { handler as GET, handler as POST };
