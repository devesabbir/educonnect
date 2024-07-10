import Image from "next/image";
import logo from "@/public/assets/logo.svg";
import { cn } from "@/lib/utils";
export const Logo = ({ className = "" }) => {
  return (
    <Image
      className={cn("max-w-[100px]", className)}
      width={100}
      height={100}
      src={logo}
      alt="logo"
    />
  );
};
