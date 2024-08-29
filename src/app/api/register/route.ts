import { hash } from "@node-rs/argon2";
import { sql } from "@vercel/postgres";
import { generateIdFromEntropySize } from "lucia";
import { type NextRequest, NextResponse } from "next/server";

const DatabaseErrors = {
  UniqueViolationError: {
    message:
      'duplicate key value violates unique constraint "users_username_key"',
  },
};
export async function POST(nextRequest: NextRequest) {
  const request = await nextRequest.formData();
  const username = request.get("username");
  const password = request.get("password");

  // validate username and password
  if (!username || !password) {
    return NextResponse.json({ error: "No username or no password supplied" });
  }
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return NextResponse.json({ error: "Invalid username" });
  }
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return NextResponse.json({ error: "Invalid password" });
  }

  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  const userId = generateIdFromEntropySize(10);

  // handle any database errors
  try {
    const result =
      await sql`INSERT INTO users (id, username, passwordHash, role) VALUES (${userId}, ${username}, ${passwordHash}, 'user')`;
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case DatabaseErrors.UniqueViolationError.message:
          return NextResponse.json({ error: "Username already exists" });
          break;
        default:
          console.error(error.message);
      }
    }
  }
  return NextResponse.json({ message: "Register success" });
}
