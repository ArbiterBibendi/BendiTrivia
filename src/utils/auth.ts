import { PostgresJsAdapter } from "@lucia-auth/adapter-postgresql";
import { Lucia } from "lucia";
import postgres from "postgres";

const sql = postgres();
const adapter = new PostgresJsAdapter(sql, {
  user: "users",
  session: "user_sessions",
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
    expires: true,
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      role: attributes.role,
    };
  },
});

interface DatabaseUserAttributes {
  username: string;
  role: string;
}
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
