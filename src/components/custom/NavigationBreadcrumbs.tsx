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
import { useLocale, useTranslations } from "next-intl";

export const NavigationBreadcrumbs = () => {
  const currentPath = usePathname();
  const t = useTranslations('navigation');
  const locale = useLocale();

  const breadcrumbs = currentPath.split("/").filter(Boolean);
  
  // Remove locale from breadcrumbs when it's present
  const filteredBreadcrumbs = breadcrumbs[0] === locale 
    ? breadcrumbs.slice(1) 
    : breadcrumbs;

  const formattedBreadcrumbs = filteredBreadcrumbs.map((breadcrumb) => {
    switch (breadcrumb) {
      case "contact":
        return { ref: `/${locale}/contact`, label: t('contact'), redirectable: false };
      case "portfolio":
        return { ref: `/${locale}/portfolio`, label: t('portfolio'), redirectable: false };
      default:
        if (filteredBreadcrumbs.includes("portfolio") && breadcrumb !== "portfolio") {
          switch (breadcrumb) {
            case "bedroom":
              return {
                ref: `/${locale}/portfolio/${breadcrumb}`,
                label: "Спальни",
                redirectable: true,
              };
            default:
              return { 
                ref: `/${locale}/portfolio/${breadcrumb}`, 
                label: breadcrumb, 
                redirectable: true 
              };
          }
        }
        return { ref: `/${locale}/${breadcrumb}`, label: breadcrumb, redirectable: true };
    }
  });

  return (
    <Breadcrumb className="px-6 py-4 bg-[#373737]">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            href={`/${locale}`}
            className="text-primary-foreground hover:text-white"
          >
            {t('home')}
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
      </BreadcrumbList>
    </Breadcrumb>
  );
};
