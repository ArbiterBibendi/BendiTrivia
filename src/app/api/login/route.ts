import {
  argonOptions,
  createSessionAndSetCookie,
  validatePassword,
  validateUsername,
} from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { verify } from "@node-rs/argon2";
import type { dbUser } from "@/utils/auth";

export async function POST(nextRequest: NextRequest) {
  const formData = await nextRequest.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const usernameValidation = validateUsername(username);
  if (!usernameValidation.valid) {
    return usernameValidation.response;
  }
  // this checks the password requirements, not whether the password matches
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return passwordValidation.response;
  }

  const dbResponse = await sql`SELECT * FROM users WHERE username=${username}`;
  if (dbResponse.rows.length <= 0) {
    return NextResponse.json(
      { error: "Username or password incorrect" },
      { status: 401 }
    );
  }
  const existingUser = dbResponse.rows[0] as dbUser;

  // this checks whether the password matches
  const validPassword = await verify(
    existingUser.passwordhash,
    password,
    argonOptions
  );

  if (!validPassword) {
    return NextResponse.json(
      { error: "Username or password incorrect" },
      { status: 401 }
    );
  }

  const response = createSessionAndSetCookie(
    existingUser.id,
    NextResponse.json(
      {
        message: `Login success to ${username}`,
      },
      { status: 200 }
    )
  );
  return response;
}
