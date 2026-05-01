/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.ahalyaa.com",
      },
      {
        protocol: "https",
        hostname: "content.jdmagicbox.com",
      },
      {
        protocol: "https",
        hostname: "ecomapi.ftdigitalsolutions.org",
      },
      {
        protocol: "http",
        hostname: "82.29.161.36",
      },
      {
        protocol: "https",
        hostname: "82.29.161.36",
      },
      {
        protocol: "https",
        hostname: "test-ecomapi.justvy.in",
      },
      {
        protocol: "https",
        hostname: "www.primeabgb.com",
      },
      {
        protocol: "http",
        hostname: "ip",
      },
    ],
  },
};

module.exports = nextConfig;
