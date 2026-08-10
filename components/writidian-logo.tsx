import Image from "next/image";
import { SITE } from "@/lib/constants";

type WritidianLogoProps = {
  /** Background tone under the logo — picks the contrasting mark */
  tone?: "light" | "dark";
  className?: string;
  /** Display height in CSS pixels */
  height?: number;
};

/** Trimmed lockup aspect from logo-*.png (333×158). */
const ASPECT = 333 / 158;

export function WritidianLogo({
  tone = "light",
  className = "",
  height = 40,
}: WritidianLogoProps) {
  const src =
    tone === "dark" ? "/images/logo-light.png" : "/images/logo-dark.png";
  const width = Math.round(height * ASPECT);

  return (
    <Image
      src={src}
      alt={SITE.name}
      width={width}
      height={height}
      className={`object-contain object-left ${className}`}
      style={{ height, width }}
      priority
    />
  );
}
