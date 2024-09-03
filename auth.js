import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "./lib/db";

import bcrypt from "bcryptjs";
import { UserModel } from "./models/user-model";
import { authConfig } from "./authConfig";

// async function refreshAccessToken(token) {
//   try {
//     const url =
//       "https://oauth2.googleapis.com/token?" +
//       new URLSearchParams({
//         client_id: process.env.GOOGLE_CLIENT_ID,
//         client_secret: process.env.GOOGLE_CLIENT_SECRET,
//         grant_type: "refresh_token",
//         refresh_token: token.refreshToken,
//       });

//     const response = await fetch(url, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       method: "POST",
//     });

//     const refreshedTokens = await response.json();

//     if (!response.ok) {
//       throw refreshedTokens;
//     }

//     return {
//       ...token,
//       accessToken: refreshedTokens?.access_token,
//       accessTokenExpires: Date.now() + refreshedTokens?.expires_in * 1000,
//       refreshToken: refreshedTokens?.refresh_token,
//     };
//   } catch (error) {
//     console.log(error);

//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     };
//   }
// }

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(client, {
    databaseName: process.env.DATABASE_NAME,
  }),
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
              const { password, ...rest } = user;
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
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      return session;
    },
  },
  // callbacks: {
  //   async jwt({ token, user, account }) {
  //     // console.log(`JWT token: ${JSON.stringify(token)}`);
  //     // console.log(`JWT Account: ${JSON.stringify(account)}`);

  //     if (account && user) {
  //       return {
  //         accessToken: account?.access_token,
  //         accessTokenExpires: Date.now() + account?.expires_in * 1000,
  //         refreshToken: account?.refresh_token,
  //         user,
  //       };
  //     }

  //     // console.log(
  //     //   `Token Will Expire at ${new Date(token.accessTokenExpires)})`
  //     // );

  //     if (Date.now() < token?.accessTokenExpires) {
  //       // console.log(`At ${new Date(Date.now())}, Using old access token`);
  //       return token;
  //     }

  //     // console.log(`Token Expired at ${new Date(Date.now())}`);
  //     return refreshAccessToken(token);
  //   },

  //   async session({ session, token }) {
  //     session.user = token?.user;
  //     session.accessToken = token?.access_token;
  //     session.error = token?.error;

  //     // console.log(`Returning Session ${JSON.stringify(session)}`);
  //     return session;
  //   },
  // },
});
