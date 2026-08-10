import Image from "next/image";
import { SITE } from "@/lib/constants";

type WritidianLogoProps = {
  /** Background tone under the logo — picks the contrasting mark */
  tone?: "light" | "dark";
  className?: string;
  /** Display height in CSS pixels */
  height?: number;
};

export function WritidianLogo({
  tone = "light",
  className = "",
  height = 32,
}: WritidianLogoProps) {
  const src =
    tone === "dark" ? "/images/logo-light.png" : "/images/logo-dark.png";

  return (
    <Image
      src={src}
      alt={SITE.name}
      width={height}
      height={height}
      className={`object-contain object-left ${className}`}
      style={{ height, width: "auto", maxWidth: height * 4 }}
      priority
    />
  );
}
