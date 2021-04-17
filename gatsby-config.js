module.exports = {
  siteMetadata: {
    description: "Personal page of Minh Phan",
    locale: "en",
    title: "Minh Phan - Profile",
    formspreeEndpoint: "https://formspree.io/f/xpzkwpjy",
  },
  plugins: [
    {
      resolve: "@wkocjan/gatsby-theme-intro",
      options: {
        theme: "classic",
        showThemeLogo: false,
      },
    },
  ],
};
