import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import App from "~App"

export const queryClient = new QueryClient()

function IndexPopup() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
}
export default IndexPopup
