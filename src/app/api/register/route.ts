import { hash } from "@node-rs/argon2";
import { sql } from "@vercel/postgres";
import { generateIdFromEntropySize } from "lucia";
import { type NextRequest, NextResponse } from "next/server";

type UserFormData = {
  username: string;
  password: string;
};
export async function POST(nextRequest: NextRequest) {
  const request: unknown = await nextRequest.formData();
  const userFormData: UserFormData = request as UserFormData;
  const { username, password: plaintextPassword } = userFormData;

  // validate username and password
  if (!username || !plaintextPassword) {
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
    typeof plaintextPassword !== "string" ||
    plaintextPassword.length < 6 ||
    plaintextPassword.length > 255
  ) {
    return NextResponse.json({ error: "Invalid password" });
  }

  const passwordHash = await hash(plaintextPassword, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  const userId = generateIdFromEntropySize(10);

  const result =
    await sql`INSERT INTO users (id, username, passwordHash, role) VALUES (${userId}, ${username}, ${passwordHash}, user)`;
  if (result) console.log(request);
  return NextResponse.json({ message: "registering" });
}
