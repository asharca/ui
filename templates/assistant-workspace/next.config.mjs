const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export default {
  ...(basePath ? { basePath } : {}),
  output: "export",
  trailingSlash: true,
  devIndicators: false,
  images: { unoptimized: true },
};
