"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export const NavigationBreadcrumbs = () => {
  const currentPath = usePathname();

  const breadcrumbs = currentPath.split("/").filter(Boolean);

  const formattedBreadcrumbs = breadcrumbs.map((breadcrumb) => {
    switch (breadcrumb) {
      case "contact":
        return { ref: "/contact", label: "Контакты", redirectable: false };
      case "portfolio":
        return { ref: "/portfolio", label: "Портфолио", redirectable: false };
      default:
        if (breadcrumbs.includes("portfolio") && breadcrumb !== "portfolio") {
          switch (breadcrumb) {
            case "bedroom":
              return {
                ref: `/portfolio/${breadcrumb}`,
                label: "Спальни",
                redirectable: true,
              };
          }
        }
        return { ref: `/${breadcrumb}`, label: breadcrumb, redirectable: true };
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
        {formattedBreadcrumbs.map((breadcrumb, index) => (
          <Fragment key={breadcrumb.ref}>
            <BreadcrumbSeparator className="text-muted" />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={breadcrumb.redirectable ? breadcrumb.ref : undefined}
                className="text-primary-foreground hover:text-white"
              >
                {breadcrumb.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Fragment>
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
