import { useQuery } from "@tanstack/react-query"

import { SignIn, SignOut, useIsAuthed } from "~features/auth"
import { fetchUser } from "~features/user"

// const App = () => {
//   const auth = useIsAuthed()
//   return <div>hello world</div>
// }
export const App = () => {
  const auth = useIsAuthed()
  const user = useQuery(["user", auth.isAuthed], fetchUser, {
    enabled: auth.isAuthed
  })

  if (auth.isAuthenticating) {
    return <div>Authenticating...</div>
  }
  if (!auth.isAuthed) {
    return (
      <div>
        <h1>Please log in</h1>
        <SignIn />
      </div>
    )
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <h1>
        Welcome to your <a href="https://www.plasmo.com">Plasmo</a> Extension!
      </h1>
      <p>You're signed in!</p>
      {user.data && (
        <div>
          <p>
            <strong>Name:</strong> {user.data.name}
          </p>
        </div>
      )}
      <SignOut />
    </div>
  )
}
export default App
