import { useMutation } from "@tanstack/react-query"
import React from "react"

import { getStorageToken, storage } from "~features/storage"

/**
 * The sign in button sends the user to the NextAuth signin page with a callback to NextJS /auth/extension page.
 * The callback URL (/auth/extension) is a page that will send the accessToken to the extension's background page.
 *
 * The background page will persist the accessToken in storage.
 *
 * This module also exports a useIsAuthed hook that validates the extension's accessToken with the server.
 */
export const signIn = () => {
  console.log({ processEnv: process.env })
  const signInUrl = `${process.env.PLASMO_PUBLIC_WEB_URL}/api/auth/signin`
  const callbackUrl = `${process.env.PLASMO_PUBLIC_WEB_URL}/auth/extension`
  window.open(
    `${signInUrl}?${new URLSearchParams({
      callbackUrl
    }).toString()}`
  )
}
export const SignIn = () => {
  return (
    <button className="h-12 font-medium" onClick={signIn}>
      Sign In
    </button>
  )
}
export const signOut = () => {
  window.open(`${process.env.PLASMO_PUBLIC_WEB_URL}/auth/signout`)
}

export const SignOut = () => {
  return (
    <button className="h-12 font-medium" onClick={signOut}>
      Sign Out
    </button>
  )
}
const fetchSessionValidate = async ({ token }: { token: string }) => {
  const res = await fetch(
    `${process.env.PLASMO_PUBLIC_WEB_URL}/api/session/validate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token })
    }
  )
  if (!res.ok) {
    throw new Error("Invalid token")
  }
  return res.json()
}
/**
 * Custom hook to get the accessToken from storage
 * and validate it with the server
 * @returns boolean whether the token is valid or not
 */
export const useIsAuthed = () => {
  const [isAuthed, setIsAuthed] = React.useState(false)
  const [isAuthenticating, setisAuthenticating] = React.useState(true)

  const { mutate: validateSession } = useMutation(fetchSessionValidate, {
    onSuccess() {
      setIsAuthed(true)
    },
    onSettled() {
      setisAuthenticating(false)
    },
    onError() {
      setIsAuthed(false)
    }
  })

  // Validate the token on server
  React.useEffect(() => {
    void getStorageToken().then(({ token }) => {
      validateSession({ token })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { isAuthed, isAuthenticating }
}
