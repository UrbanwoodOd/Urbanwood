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
        <h2 className="text-2xl font-bold mb-6">Контакты</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Свяжитесь с нами</h3>
              <p className="text-primary">
                Телефон: +38 (067) 557-81-96 (Viber, Whatsapp, Telegram)
              </p>
              <p className="text-primary">Email: info@urbanwood.com.ua</p>
            </div>
          </div>
          <div>
            <div>
              <h3 className="text-lg font-semibold">Адрес</h3>
              <p className="text-primary">Одесса, Онежская 3</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Рабочие часы</h3>
              <p className="text-primary">
                Пн-Вс: 10:00-18:00, по предварительной записи
              </p>
            </div>
          </div>
        </div>
      </section>
      <PlaceOnMap center={[30.696091, 46.455461]} />
      <Footer />
    </>
  );
};
