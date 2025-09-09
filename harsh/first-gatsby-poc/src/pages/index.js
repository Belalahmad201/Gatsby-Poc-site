import React from "react"
import { graphql } from "gatsby"

export default function Home({ data }) {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {data.allMarkdownRemark.nodes.map(node => (
        <div key={node.id}>
          <h2>{node.frontmatter.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: node.html }} />
        </div>
      ))}
    </div>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark {
      nodes {
        id
        frontmatter {
          title
        }
        html
      }
    }
  }
`
