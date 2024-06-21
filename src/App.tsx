import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { Button } from "./components/ui/button"
import RootLayout from "./pages/layout"
import PaimentDetails from "./pages/paimentDetails"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="*" element={<Navigate to="/pogoPayDetails" />} />
            <Route path="pogoPayDetails" element={<PaimentDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
