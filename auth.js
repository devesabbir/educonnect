import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { UserModel } from "./models/user-model";
import { authConfig } from "./authConfig";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        try {
          const user = await UserModel.findOne({ email: credentials?.email });

          if (user) {
            const isMatch = bcrypt.compareSync(
              credentials.password,
              user.password
            );
            if (isMatch) {
              return user;
            } else {
              throw new Error("Password mismatch!");
            }
          } else {
            throw new Error("User not found!");
          }
        } catch (e) {
          throw new Error(`Could not authorize User ${credentials}`);
        }
      },
    }),
  ],
});
