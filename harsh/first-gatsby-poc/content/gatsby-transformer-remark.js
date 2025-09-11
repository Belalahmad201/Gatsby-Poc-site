import * as React from "react"
import "./blog.css" // Your CSS file

export default function BlogPost({ data }) {
  return (
    <div className="markdown-container">
      <div
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}
      />
    </div>
  )
}
