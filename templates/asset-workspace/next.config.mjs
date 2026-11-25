/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const config = {
  ...(basePath ? { basePath } : {}),
  output: "export",
  trailingSlash: true,
  devIndicators: false,
  images: { unoptimized: true },
};
export default config;
