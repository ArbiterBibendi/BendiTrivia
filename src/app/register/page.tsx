"use client";

import { FormHint } from "@/components/formHint";
import { FormEvent, RefObject, SetStateAction, useRef, useState } from "react";

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
function onFocus(
  e: React.FormEvent<HTMLInputElement>,
  usernameRef: RefObject<HTMLInputElement>,
  setUsernameHint: Function,
  passwordRef: RefObject<HTMLInputElement>,
  setPasswordHint: Function
) {
  if (!usernameRef.current || !passwordRef.current) {
    return;
  }
  if (
    e.currentTarget != usernameRef.current &&
    usernameRef.current?.value != ""
  ) {
    if (usernameRef.current?.value.length < 3) {
      setUsernameHint(" * Must be at least 3 characters");
    } else if (!/^[a-z0-9_-]+$/.test(usernameRef.current?.value)) {
      setUsernameHint(
        " * Must not contain any special characters other than _ and -"
      );
    } else {
      setUsernameHint("");
    }
  }
  if (
    e.currentTarget != passwordRef.current &&
    passwordRef.current?.value != ""
  ) {
    if (passwordRef.current?.value.length < 6) {
      setPasswordHint(" * Must be at least 6 characters");
    } else {
      setPasswordHint("");
    }
  }
}
function onPasswordInput(
  e: React.FormEvent<HTMLInputElement>,
  passwordRef: RefObject<HTMLInputElement>,
  passwordConfirmRef: RefObject<HTMLInputElement>
) {
  if (!passwordRef.current || !passwordConfirmRef.current) {
    return;
  }
  if (
    passwordRef.current.value == "" ||
    passwordConfirmRef.current.value == ""
  ) {
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
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  const [usernameHint, setUsernameHint] = useState("");
  const [passwordHint, setPasswordHint] = useState("");
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
            <FormHint hint={usernameHint} />
            <tr>
              <td>
                <label htmlFor="username">Username</label>
              </td>
              <td>
                <input
                  name="username"
                  id="username"
                  ref={usernameRef}
                  onFocus={(e) =>
                    onFocus(
                      e,
                      usernameRef,
                      setUsernameHint,
                      passwordRef,
                      setPasswordHint
                    )
                  }
                />
              </td>
            </tr>
            <FormHint hint={passwordHint} />
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
                  onFocus={(e) =>
                    onFocus(
                      e,
                      usernameRef,
                      setUsernameHint,
                      passwordRef,
                      setPasswordHint
                    )
                  }
                  onInput={(e) =>
                    onPasswordInput(e, passwordRef, passwordConfirmRef)
                  }
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
                    onPasswordInput(e, passwordRef, passwordConfirmRef)
                  }
                  onFocus={(e) =>
                    onFocus(
                      e,
                      usernameRef,
                      setUsernameHint,
                      passwordRef,
                      setPasswordHint
                    )
                  }
                />
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
