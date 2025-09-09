import React from "react"
import BlogPost from "./components/BlogPost.js"
import markdownContent from "./content/mycontent.md"

export default function App() {
  return <BlogPost content={markdownContent} />
}
