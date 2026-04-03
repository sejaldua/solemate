/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/solemate",
  assetPrefix: "/solemate/",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ["framer-motion", "d3-scale", "d3-zoom", "d3-selection"],
  },
};

export default nextConfig;
