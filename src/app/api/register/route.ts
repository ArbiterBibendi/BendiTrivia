import { argonOptions, validatePassword, validateUsername } from "@/utils/auth";
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
  const formData = await nextRequest.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // validate username and password
  const usernameValidation = validateUsername(username);
  if (!usernameValidation.valid) {
    return usernameValidation.response;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return passwordValidation.response;
  }

  const passwordHash = await hash(password, argonOptions);
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
