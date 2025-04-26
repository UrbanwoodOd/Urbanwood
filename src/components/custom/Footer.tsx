"use client";

import { FacebookIcon } from "@/components/icons/Facebook";
import { InstagramIcon } from "@/components/icons/Instagram";
import { useTranslations } from "next-intl";

export const Footer = () => {
  const t = useTranslations("footer");

  return (
    <footer className="bg-[#373737] text-muted p-10">
      <div className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative">
          <div className="w-full md:w-1/3">
            <h3 className="text-base font-semibold mb-4">{t("followUs")}</h3>
            <ul className="flex gap-4">
              <li className="hover:text-gray-600 transition-colors">
                <a
                  href="https://www.facebook.com/ukraineurbanwood/"
                  className="flex items-center gap-2"
                >
                  <FacebookIcon className="fill-white size-8" />
                </a>
              </li>
              <li className="hover:text-gray-600 transition-colors">
                <a
                  href="https://www.instagram.com/urbanwood_odessa/"
                  className="flex items-center gap-2"
                >
                  <InstagramIcon className="fill-white size-8" />
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-base font-semibold mb-4">
              {t("popularFurniture")}
            </h3>
            <ul className="space-y-2">
              <li className="hover:text-gray-600 text-sm transition-colors">
                <a href="#">{t("customFurniture")}</a>
              </li>
              <li className="hover:text-gray-600 text-sm transition-colors">
                <a href="#">{t("loftFurniture")}</a>
              </li>
              <li className="hover:text-gray-600 text-sm transition-colors">
                <a href="#">{t("customWardrobes")}</a>
              </li>
              <li className="hover:text-gray-600 text-sm transition-colors">
                <a href="#">{t("classicKitchens")}</a>
              </li>
              <li className="hover:text-gray-600 text-sm transition-colors">
                <a href="#">{t("tables")}</a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <p className="text-sm mt-8">{t("copyright")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
