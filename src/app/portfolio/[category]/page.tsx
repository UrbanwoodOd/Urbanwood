import { Footer } from "@/components/custom/Footer";
import { MainNavigation } from "@/components/custom/MainNavigation";
import { NavigationBreadcrumbs } from "@/components/custom/NavigationBreadcrumbs";
import { PortfolioPage } from "@/components/pages/Portfolio.page";

export default async function PortfolioCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  return (
    <main className="container mx-auto">
      <MainNavigation />
      <NavigationBreadcrumbs />

      <PortfolioPage category={category} />

      <Footer />
    </main>
  );
}
