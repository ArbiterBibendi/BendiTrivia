"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathName = usePathname();
  const pathsToExcludeLogoutLink = ["/logout", "/login"];
  return (
    <nav>
      <Link href="/" className="homeNavLink">
        <h1>BendiTrivia</h1>
      </Link>
      {pathsToExcludeLogoutLink.includes(pathName) ? (
        ""
      ) : (
        <Link href="/logout">Logout</Link>
      )}
    </nav>
  );
}
