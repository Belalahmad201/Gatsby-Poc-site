# Backlink Checker App (Node.js)

This project is a **Backlink Checker App** built with Node.js.  
It allows you to check **backlinks** present on any given webpage against a target domain (e.g., `hexahome.in`).  

The app extracts all links (`<a>` tags) from the webpage and provides the following details:
- Whether the link is **DoFollow** or **NoFollow**.
- The **anchor text** of the backlink.
- The **count of backlinks** present on the page for the specified domain.

---

## Features

- Input: A webpage URL and a target domain (e.g., `hexahome.in`).
- Output: JSON report of all backlinks found with details:
  - `href` (link URL)
  - `rel` attribute (to determine **follow/no-follow**)
  - `anchor text`
- Counts how many backlinks point to the given domain.
- Can be extended to check multiple domains or pages.

---