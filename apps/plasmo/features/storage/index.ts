import { z } from "zod"

import { Storage } from "@plasmohq/storage"

export const storage = new Storage()

// the zod schema for our chrome storage stuff
const ChromeStorageSchema = z.object({
  accessToken: z.string()
})
export const ChromeStorage = ChromeStorageSchema.shape

export const getStorageToken = async () => {
  const token = await storage.get("accessToken")
  if (ChromeStorage.accessToken.safeParse(token).success) {
    return { token, status: "success" } as const
  }
  return { token: null, status: "error" } as const
}
