import React from "react"
import { Link } from "gatsby"

const Navbar = () => (
  <nav style={{ marginBottom: "2rem" }}>
    <Link to="/">Home</Link> |{" "}
    <Link to="/about">About</Link> |{" "}
    <Link to="/contact">Contact</Link>
  </nav>
)

export default Navbar

