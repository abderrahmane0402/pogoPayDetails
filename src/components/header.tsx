import { Link } from "react-router-dom"
import pogo from "../assets/pogo.png"

export default function Header() {
  return (
    <header className="w-full border-b shadow-sm">
      <div className="wrapper flex items-center justify-between gap-5">
        <Link to={"/"}>
          <img src={pogo} alt="logo" width={120} height={28} />
        </Link>
        <nav className="flex gap-2 items-center"></nav>
        <div className="flex justify-end w-[150px] gap-4"></div>
      </div>
    </header>
  )
}
