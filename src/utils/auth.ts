import { PostgresJsAdapter } from "@lucia-auth/adapter-postgresql";
import { Lucia } from "lucia";
import postgres from "postgres";
import type { User, Session } from "lucia";
import { cookies } from "next/headers";

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

export async function validateRequest(user: User, session: Session) {
  const sessionId = cookies().get(lucia.sessionCookieName);
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId.value);
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {}
  return result;
}

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
