import type { User } from "@acme/db"

import { getStorageToken } from "~features/storage"

export const fetchUser = async () => {
  const { token, status } = await getStorageToken()

  const response = await fetch("http://localhost:3000/api/user", {
    headers:
      status === "success"
        ? {
            Authorization: `Bearer ${token}`
          }
        : {}
  })
  if (!response.ok) {
    throw Error("Failed to fetch user")
  }
  return (await response.json()) as User
}
