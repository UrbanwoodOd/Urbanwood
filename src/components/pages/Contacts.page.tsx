import { Footer } from "../custom/Footer";
import { MainNavigation } from "../custom/MainNavigation";
import { NavigationBreadcrumbs } from "../custom/NavigationBreadcrumbs";
import { PlaceOnMap } from "../custom/PlaceOnMap";

export const ContactsPage = () => {
  return (
    <>
      <MainNavigation />
      <NavigationBreadcrumbs />
      <section className="container mx-auto py-8 px-8">
        <h2 className="text-2xl font-bold mb-6">Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Contact Us</h3>
              <p className="text-gray-700">
                Phone: +38 (067) 557-81-96 (Viber, Whatsapp, Telegram)
              </p>
              <p className="text-gray-700">Email: info@urbanwood.com.ua</p>
            </div>
          </div>
          <div>
            <div>
              <h3 className="text-lg font-semibold">Address</h3>
              <p className="text-gray-700">Odessa</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Working Hours</h3>
              <p className="text-gray-700">Mon-Fri: 9:00-18:00</p>
              <p className="text-gray-700">Sat-Sun: By appointment</p>
            </div>
          </div>
        </div>
      </section>
      <PlaceOnMap center={[30.696091, 46.455461]} />
      <Footer />
    </>
  );
};
