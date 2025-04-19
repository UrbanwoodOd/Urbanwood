"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export const NavigationBreadcrumbs = () => {
  const currentPath = usePathname();

  const breadcrumbs = currentPath.split("/").filter(Boolean);

  const formattedBreadcrumbs = breadcrumbs.map((breadcrumb) => {
    switch (breadcrumb) {
      case "contact":
        return "Контакты";
      case "about":
        return "Про нас";
      default:
        return breadcrumb;
    }
  });

  return (
    <Breadcrumb className="px-6 py-4 bg-[#373737]">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/"
            className="text-primary-foreground hover:text-white"
          >
            Главная
          </BreadcrumbLink>
        </BreadcrumbItem>
        {formattedBreadcrumbs.map((breadcrumb) => (
          <BreadcrumbItem key={breadcrumb}>
            <BreadcrumbLink
              href={`/${breadcrumb}`}
              className="text-primary-foreground hover:text-white"
            >
              {breadcrumb}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
        {/* <BreadcrumbSeparator className="text-muted" />
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/components"
            className="text-primary-foreground"
          >
            Components
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-primary-foreground" />
        <BreadcrumbItem>
          <BreadcrumbPage className="text-primary-foreground">
            Breadcrumb
          </BreadcrumbPage>
        </BreadcrumbItem> */}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
