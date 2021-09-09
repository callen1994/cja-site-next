/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  images: {
    // most of my images are hosted at imgur because that seemed easy.
    // I pulled one image from the wix site of the Seven Stills
    domains: ["i.imgur.com", "static.wixstatic.com"],
  },
};
