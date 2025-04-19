import Image from "next/image";
import Link from "next/link";

export const MainNavigation = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-0">
      <Image
        src="/logo_full.jpg"
        alt="logo"
        className="ml-6"
        width={288}
        height={100}
      />
      <ul className="flex items-center h-20 font-semibold">
        <li className="bg-primary text-primary-foreground h-full flex items-center justify-center px-5">
          <Link href="/">Главная</Link>
        </li>
        <li className="h-full text-primary flex items-center justify-center px-5">
          <Link href="/about">Портфолио</Link>
        </li>
        <li className="h-full text-primary flex items-center justify-center px-5">
          <Link href="/contact">Контакты</Link>
        </li>
      </ul>
    </nav>
  );
};
