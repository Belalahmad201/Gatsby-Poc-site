module.exports = {
  siteMetadata: {
    title: "First Gatsby POC",
    author: "Your Name", // add this line
  },
  plugins: [
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/content/`,
      },
    },
  ],
}

