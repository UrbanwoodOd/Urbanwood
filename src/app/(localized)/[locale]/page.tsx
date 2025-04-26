"use client";

import { Footer } from "@/components/custom/Footer";
import { FurnitureCategoriesList } from "@/components/custom/FurnitureCategoriesList";
import { MainGalleryCarousel } from "@/components/custom/MainGalleryCarousel";
import { MainNavigation } from "@/components/custom/MainNavigation";
import { NavigationBreadcrumbs } from "@/components/custom/NavigationBreadcrumbs";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home");

  return (
    <main className="container mx-auto">
      <MainNavigation />
      <MainGalleryCarousel />
      <NavigationBreadcrumbs />

      <section className="container mx-auto py-8 px-8">
        <h2 className="text-3xl font-bold mb-4">{t("title")}</h2>

        <FurnitureCategoriesList />

        <div className="space-y-4 text-sm leading-7 text-[#040404]">
          <p>
            <strong>{t("paragraphs.p1.furnitureInOdessa")}</strong>
            {t("paragraphs.p1.start")}
            <strong>{t("paragraphs.p1.customFurniture")}</strong>
            {t("paragraphs.p1.end")}
          </p>

          <p>{t("paragraphs.p2")}</p>

          <p>
            {t("paragraphs.p3.start")}
            <strong>{t("paragraphs.p3.furnitureInOdessa")}</strong>
            {t("paragraphs.p3.end")}
          </p>

          <p>{t("paragraphs.p4")}</p>

          <p>{t("paragraphs.p5")}</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
