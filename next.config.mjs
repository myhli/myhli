import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "**",
      },
    ],
  },
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  allowedDevOrigins: ['127.0.2.2', 'localhost:3000', '192.168.10.107'],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/about",
        permanent: false,
      },
    ];
  },
};

export default withMDX(nextConfig);
