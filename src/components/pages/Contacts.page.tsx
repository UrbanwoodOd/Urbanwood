"use client";

import { useTranslations } from "next-intl";
import { PlaceOnMap } from "../custom/PlaceOnMap";

export const ContactsPage = () => {
  const t = useTranslations("contact");

  return (
    <>
      <section className="container mx-auto py-8 px-8">
        <h2 className="text-2xl font-bold mb-6">{t("title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{t("subtitle")}</h3>
              <p className="text-primary">
                {t("phone")}: +38 (067) 557-81-96 (Viber, Whatsapp, Telegram)
              </p>
              <p className="text-primary">
                {t("email")}: info@urbanwood.com.ua
              </p>
            </div>
          </div>
          <div>
            <div>
              <h3 className="text-lg font-semibold">{t("address")}</h3>
              <p className="text-primary">{t("addressValue")}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{t("workingHours")}</h3>
              <p className="text-primary">{t("workingHoursValue")}</p>
            </div>
          </div>
        </div>
      </section>
      <PlaceOnMap center={[30.696091, 46.455461]} />
    </>
  );
};
