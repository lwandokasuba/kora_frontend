import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Mock authentication
        if (credentials.email === "user@example.com" && credentials.password === "password") {
          return {
            id: "1",
            name: "User",
            email: "user@example.com",
          }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
})
