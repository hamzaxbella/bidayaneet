import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BidayaNeet Terrain",
    short_name: "BidayaNeet",
    lang: "fr",
    start_url: "/terrain",
    scope: "/",
    display: "standalone",
    background_color: "#f4f8f7",
    theme_color: "#142f42",
    icons: [192, 512].map((size) => ({
      src: `/icon-${size}.png`,
      sizes: `${size}x${size}`,
      type: "image/png",
      purpose: "any",
    })),
  };
}
