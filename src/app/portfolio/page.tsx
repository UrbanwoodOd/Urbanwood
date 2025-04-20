import { Footer } from "@/components/custom/Footer";
import { MainNavigation } from "@/components/custom/MainNavigation";
import { NavigationBreadcrumbs } from "@/components/custom/NavigationBreadcrumbs";
import { PortfolioPage } from "@/components/pages/Portfolio.page";

export default function PortfolioMainPage() {
  return (
    <main className="container mx-auto">
      <MainNavigation />
      <NavigationBreadcrumbs />

      <PortfolioPage />

      <Footer />
    </main>
  );
}