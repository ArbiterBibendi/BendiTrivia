import { invalidateSessionAndSetBlankCookie } from "@/utils/auth";

export function GET() {
  return invalidateSessionAndSetBlankCookie();
}
