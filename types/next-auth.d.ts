import { DefaultSession } from "next-auth";
import { Role } from "@prisma/client"; // ← if you export Role from Prisma

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role: Role | string; // or string if you don't want to import Role
    } & DefaultSession["user"];
  }

  // When using credentials provider, the user object can have these extra fields
  interface User {
    id: string;
    role: Role | string; // or string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role | string; // or string
  }
}
