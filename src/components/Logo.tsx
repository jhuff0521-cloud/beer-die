import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/dielogo.png"
      alt="Beer Die"
      width={519}
      height={159}
      priority
      className={className}
      style={{ width: "auto", height: "2.5rem" }}
    />
  );
}
