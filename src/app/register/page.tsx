"use client";

import { redirect } from "next/navigation";
import { FormEvent } from "react";

async function onSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  try {
    const formData = new FormData(e.currentTarget);
    const response = await fetch("/api/register", {
      method: "POST",
      body: formData,
    });
    if (response.status == 201) {
      window.location.replace("/");
    }
  } catch (error) {
    console.error(error);
  }
}

export default function Page() {
  return (
    <>
      <h1>
        Create an account
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
                  <button>Continue</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </h1>
    </>
  );
}

interface ActionResult {
  error: string;
}
