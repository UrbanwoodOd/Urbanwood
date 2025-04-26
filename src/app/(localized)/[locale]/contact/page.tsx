import { Footer } from "@/components/custom/Footer";
import { MainNavigation } from "@/components/custom/MainNavigation";
import { NavigationBreadcrumbs } from "@/components/custom/NavigationBreadcrumbs";
import { ContactsPage } from "@/components/pages/Contacts.page";

export default function Contact() {
  return (
    <main className="container mx-auto">
      <MainNavigation />
      <NavigationBreadcrumbs />
      <ContactsPage />
      <Footer />
    </main>
  );
}