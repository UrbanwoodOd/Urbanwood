"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/supabase/supabase";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export const PortfolioDropdown = ({
  currentPath,
  activeClassname,
  inactiveClassname,
}: {
  currentPath: string;
  activeClassname: string;
  inactiveClassname: string;
}) => {
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const [isTriggerHovered, setIsTriggerHovered] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);

  useEffect(() => {
    if (isTriggerHovered || isDropdownHovered) {
      setIsListOpen(true);
    } else if (!isTriggerHovered && !isDropdownHovered && isListOpen) {
      const timer = setTimeout(() => {
        setIsListOpen(false);
      }, 300);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isTriggerHovered, isDropdownHovered, isListOpen]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get<{ categories: Category[] }>(
        "/api/get-category",
      );
      return response.data.categories;
    },
  });

  return (
    <DropdownMenu open={isListOpen} onOpenChange={setIsListOpen}>
      <DropdownMenuTrigger asChild>
        <li
          onMouseEnter={() => setIsTriggerHovered(true)}
          onMouseLeave={() => setIsTriggerHovered(false)}
          className={cn(
            currentPath === "/portfolio" ? activeClassname : inactiveClassname,
            isListOpen &&
              "bg-[#373737] hover:bg-[#373737] text-primary-foreground",
          )}
        >
          <span className="flex items-center">Портфолио</span>
        </li>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="shadow-xl"
        side="bottom"
        align="start"
        onMouseEnter={() => setIsDropdownHovered(true)}
        onMouseLeave={() => setIsDropdownHovered(false)}
      >
        {categories?.map((category) => (
          <DropdownMenuItem key={category._id}>
            <Link href={`/portfolio/${category.slug}`}>{category.name}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

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

  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };

    getUser();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div
      className={cn(
        "bg-white flex items-center justify-between py-0",
        isScrolled
          ? "fixed top-0 left-0 right-0 shadow-md z-50 animate-slideDown"
          : "relative",
      )}
    >
      <nav className="container w-full mx-auto flex items-center justify-between">
        <Image
          src="/logo_full.jpg"
          alt="logo"
          className="ml-6 cursor-pointer"
          onClick={() => router.push("/")}
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

          <PortfolioDropdown
            currentPath={currentPath}
            activeClassname={activeClassname}
            inactiveClassname={inactiveClassname}
          />
          <li
            className={`${
              currentPath === "/contact" ? activeClassname : inactiveClassname
            }`}
          >
            <Link href="/contact">Контакты</Link>
          </li>
          {user && user.email === "vadimkbondarchuk@gmail.com" ? (
            <li
              className={`${
                currentPath === "/admin" ? activeClassname : inactiveClassname
              }`}
            >
              <Link href="/admin">Админ</Link>
            </li>
          ) : null}
        </ul>
      </nav>
    </div>
  );
};
