import Navbar from "../components/Navbar"

import * as React from "react"
import { Link } from "gatsby"

const ContactPage = () => (
  <main>
<Navbar />
    <h1>Contact Us</h1>
    <p>You can reach us at contact@example.com</p>
    <Link to="/">Go Home</Link>
  </main>
)

export default ContactPage
