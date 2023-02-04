/* eslint-disable @typescript-eslint/no-misused-promises */
import { storage } from "~features/storage"

const WEB_URL = process.env.PLASMO_PUBLIC_WEB_URL
/**
 * The background service worker listens on external messages from the web app.
 * This requires the connect_externally specification in the manifest.
 * See @link https://developer.chrome.com/docs/extensions/mv3/messaging/#external-webpage
 */
chrome.runtime.onMessageExternal.addListener(
  async (request, sender, sendResponse) => {
    // check that the sender's origin is our web app
    console.assert(
      sender.url?.includes(WEB_URL),
      `sender url not whitelisted | provided: ${sender.url} | checked against: ${WEB_URL}}`
    )
    if (!sender.url?.includes(WEB_URL)) return // don't allow this web page access

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    switch (request.action) {
      case "signin": {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const token = request.accessToken as string
        // get out storage value, and see if it's the same as incoming
        const storageValue = await storage.get<unknown>("accessToken")
        if (storageValue === token) {
          sendResponse({ success: true })
          return
        }

        // update chrome storage w/ token, and check if it worked
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        await storage.set("accessToken", request.accessToken)
        const updatedAccessToken = await storage.get<unknown>("accessToken")
        const success = updatedAccessToken === token

        // send response
        sendResponse({ success })
        break
      }
      case "signout": {
        // reset chrome storage
        await storage.set("accessToken", null)
        const updated = await storage.get("accessToken")

        // respond with success message
        sendResponse({
          success: updated === null
        })
        break
      }
      default:
        console.error("[Plasmo Background Script]: Unknown action received")
    }
  }
)
