"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const MainNavigation = () => {
  const currentPath = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
        document.body.style.paddingTop = "80px";
      } else {
        setIsScrolled(false);
        document.body.style.paddingTop = "0";
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.paddingTop = "0";
    };
  }, []);

  const activeClassname =
    "bg-[#838383] text-primary-foreground h-full flex items-center justify-center px-5 hover:bg-primary transition-colors";
  const inactiveClassname =
    "h-full text-primary hover:text-primary-foreground flex items-center justify-center px-5 hover:bg-primary transition-colors";

  return (
    <nav
      className={cn(
        "flex items-center justify-between py-0",
        isScrolled
          ? "fixed top-0 left-0 right-0 bg-white shadow-md z-50 animate-slideDown lg:px-[100px]"
          : "relative",
      )}
    >
      <Image
        src="/logo_full.jpg"
        alt="logo"
        className="ml-6"
        width={isScrolled ? 200 : 288}
        height={isScrolled ? 70 : 100}
      />
      <ul
        className={`flex gap-0.5 items-center font-semibold ${
          isScrolled ? "h-16" : "h-20"
        }`}
      >
        <li
          className={`${
            currentPath === "/" ? activeClassname : inactiveClassname
          }`}
        >
          <Link href="/">Главная</Link>
        </li>
        <li
          className={`${
            currentPath === "/about" ? activeClassname : inactiveClassname
          }`}
        >
          <Link href="/about">Портфолио</Link>
        </li>
        <li
          className={`${
            currentPath === "/contact" ? activeClassname : inactiveClassname
          }`}
        >
          <Link href="/contact">Контакты</Link>
        </li>
      </ul>
    </nav>
  );
};
