import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

export const NavigationBreadcrumbs = () => {
  return (
    <Breadcrumb className="px-6 py-4 bg-primary">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="text-primary-foreground">
            Головна
          </BreadcrumbLink>
        </BreadcrumbItem>
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
