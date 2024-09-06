"use client";

import { redirect } from "next/navigation";
import { FormEvent, RefObject, useRef } from "react";

type ServerMessage = {
  error?: string;
  message?: string;
};
async function onSubmit(
  e: FormEvent<HTMLFormElement>,
  serverMessageElement: RefObject<HTMLParagraphElement>,
  passwordRef: RefObject<HTMLInputElement>,
  passwordConfirmRef: RefObject<HTMLInputElement>
) {
  e.preventDefault();

  try {
    const formData = new FormData(e.currentTarget);
    if (
      !passwordRef.current ||
      !passwordConfirmRef.current ||
      !serverMessageElement.current
    ) {
      return;
    }
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      serverMessageElement.current.innerText = "Passwords do not match";
      return;
    }
    const response = await fetch("/api/register", {
      method: "POST",
      body: formData,
    });
    if (response.status == 201) {
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
function onConfirmPasswordInput(
  e: React.FormEvent<HTMLInputElement>,
  passwordRef: RefObject<HTMLInputElement>,
  passwordConfirmRef: RefObject<HTMLInputElement>
) {
  if (!passwordRef.current || !passwordConfirmRef.current) {
    return;
  }
  if (passwordRef.current.value !== passwordConfirmRef.current.value) {
    passwordRef.current.style.border = "2px solid red";
    passwordConfirmRef.current.style.border = "2px solid red";
  } else {
    passwordRef.current.style.border = "2px solid green";
    passwordConfirmRef.current.style.border = "2px solid green";
  }
}

export default function Page() {
  const serverMessageElementRef = useRef<HTMLParagraphElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <h1>Create an account</h1>

      <form
        onSubmit={(event) =>
          onSubmit(
            event,
            serverMessageElementRef,
            passwordRef,
            passwordConfirmRef
          )
        }
      >
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
                <input
                  type="password"
                  name="password"
                  id="pass"
                  ref={passwordRef}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="password">Confirm Password</label>
              </td>
              <td>
                <input
                  type="password"
                  ref={passwordConfirmRef}
                  onInput={(e) =>
                    onConfirmPasswordInput(e, passwordRef, passwordConfirmRef)
                  }
                />
              </td>
            </tr>
            <tr>
              <td>
                <p>Password must be at least 6 characters</p>
              </td>
            </tr>
            <tr>
              <td>
                <button>Register</button>
              </td>
              <td>
                <p ref={serverMessageElementRef} className="serverMessage"></p>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </>
  );
}

interface ActionResult {
  error: string;
}
