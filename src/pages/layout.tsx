import Header from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import { Outlet } from "react-router-dom"

export default function RootLayout() {
  return (
    <div className="min-h-screen h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 py-5 overflow-auto">
        <Outlet />
      </div>
      <Toaster />
    </div>
  )
}
