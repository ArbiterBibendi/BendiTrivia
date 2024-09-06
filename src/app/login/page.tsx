"use client";

import Link from "next/link";
import { FormEvent, RefObject, useRef } from "react";

type ServerMessage = {
  error?: string;
  message?: string;
};
async function onSubmit(
  e: FormEvent<HTMLFormElement>,
  serverMessageElement: RefObject<HTMLParagraphElement>
) {
  e.preventDefault();

  try {
    const formData = new FormData(e.currentTarget);
    const response = await fetch("/api/login", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      window.location.replace("/");
    } else {
      const responseBody: ServerMessage = await response.json();
      if (serverMessageElement.current) {
        serverMessageElement.current.innerText =
          responseBody.error || responseBody.message || "";
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export default function Page() {
  const serverMessageElement = useRef<HTMLParagraphElement>(null);
  return (
    <>
      <h1>Login</h1>

      <form onSubmit={(event) => onSubmit(event, serverMessageElement)}>
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
              <td>
                <p ref={serverMessageElement} className="serverMessage"></p>
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
