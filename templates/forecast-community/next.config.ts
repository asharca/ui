import type { NextConfig } from "next";
const config: NextConfig = { output: "export", trailingSlash: true, devIndicators: false, images: { unoptimized: true } };
export default config;
