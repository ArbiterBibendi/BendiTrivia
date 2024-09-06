"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { FormEvent } from "react";

async function onSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  try {
    const formData = new FormData(e.currentTarget);
    const response = await fetch("/api/login", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      window.location.replace("/");
    }
  } catch (error) {
    console.error(error);
  }
}

export default function Page() {
  return (
    <>
      <h1>Login</h1>

      <form onSubmit={onSubmit}>
        <table>
          <tbody>
            <tr>
              <td>
                <label htmlFor="username">Username</label>
              </td>
              <td>
                <input name="username" id="username" />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="password">Password</label>
              </td>
              <td>
                <input type="password" name="password" id="pass" />
              </td>
            </tr>
            <tr>
              <td>
                <button>Sign in</button>
              </td>
            </tr>
          </tbody>
        </table>
        <Link href={"/register"}>Don't have an account? Create one here.</Link>
      </form>
    </>
  );
}

interface ActionResult {
  error: string;
}
