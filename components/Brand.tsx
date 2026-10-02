import Image from "next/image";

/** Brand identity only. Dashboard selection is intentionally URL-only. */
export default function Brand({
  width = 140,
  height = 64,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <span className="brand">
      <Image
        src="/logo.png"
        alt="BidayaNeet"
        width={width}
        height={height}
        style={{ objectFit: "contain", height: "auto" }}
      />
    </span>
  );
}
