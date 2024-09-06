import { PostgresJsAdapter } from "@lucia-auth/adapter-postgresql";
import { Lucia } from "lucia";
import postgres from "postgres";
import type { User, Session } from "lucia";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const sql = postgres({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: "require",
});
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

export const argonOptions = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};
export type dbUser = {
  username: string;
  passwordhash: string;
  id: string;
  role: string;
};
export type ValidationResponseObject = {
  valid: boolean;
  response: NextResponse;
};
export function validateUsername(username: string): ValidationResponseObject {
  if (!username) {
    return {
      valid: false,
      response: NextResponse.json({ error: "No username supplied" }),
    };
  }

  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      valid: false,
      response: NextResponse.json({
        error: "Invalid username.",
      }),
    };
  }

  return {
    valid: true,
    response: NextResponse.json({}),
  };
}

export function validatePassword(password: string): ValidationResponseObject {
  if (!password) {
    return {
      valid: false,
      response: NextResponse.json({ error: "No password supplied" }),
    };
  }

  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      valid: false,
      response: NextResponse.json({ error: "Invalid password" }),
    };
  }

  return {
    valid: true,
    response: NextResponse.json({}),
  };
}

export async function validateRequest() {
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
export async function createSessionAndSetCookie(
  userId: string,
  nextResponse: NextResponse
) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  nextResponse.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return nextResponse;
}
export async function invalidateSessionAndSetBlankCookie() {
  const sessionId = cookies().get(lucia.sessionCookieName);
  const response = NextResponse.json(
    { message: "Logging out" },
    { status: 200 }
  );
  const blankCookie = lucia.createBlankSessionCookie();
  response.cookies.set(
    blankCookie.name,
    blankCookie.value,
    blankCookie.attributes
  );
  if (!sessionId) {
    return response;
  }
  await lucia.invalidateSession(sessionId.value);
  return response;
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
