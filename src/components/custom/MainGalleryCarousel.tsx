"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

const images = [
  {
    src: "/mebel-na-zakaz.jpg",
    alt: "Image 1",
    text: "Дизайн, проектирование и изготовление корпусной мебели на заказ",
  },
  {
    src: "/mebel-dlya-kafe-barov-restoranov.jpg",
    alt: "Image 1",
    text: "Мебель для кафе, ресторанов, баров",
  },
  {
    src: "/mebel_loft.jpg",
    alt: "Image 1",
    text: "Мебель Loft для офиса или дома",
  },
];

export const MainGalleryCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textTransition, setTextTransition] = useState<
    "slide-out" | "slide-in" | null
  >(null);
  const [currentText, setCurrentText] = useState(images[0].text);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setTextTransition("slide-out");

      setTimeout(() => {
        const index = api.selectedScrollSnap();
        setCurrentIndex(index);
        setCurrentText(images[index].text);
        setTextTransition("slide-in");
      }, 700); // Match this with the CSS transition duration
    });

    setCurrentIndex(api.selectedScrollSnap());
    setCurrentText(images[api.selectedScrollSnap()].text);

    const autoPlayInterval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(autoPlayInterval);
  }, [api]);

  return (
    <Carousel
      className="w-full mx-auto"
      setApi={setApi}
      opts={{
        loop: true,
      }}
    >
      <div className="relative">
        <CarouselContent className="w-full">
          {images.map((image, index) => (
            <CarouselItem key={index} className="w-full relative">
              <img src={image.src} alt={image.alt} className="w-full" />
              <div className="absolute inset-0 flex items-center pointer-events-none">
                <div className="ml-16 p-4 pr-16 rounded text-white text-[44px] leading-normal font-bold overflow-hidden">
                  <div
                    className={`transition-transform duration-700 ${
                      textTransition === "slide-out"
                        ? "-translate-x-full opacity-0"
                        : textTransition === "slide-in"
                        ? "translate-x-0 opacity-100"
                        : ""
                    }`}
                  >
                    {currentText}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto">
            <CarouselPrevious className="relative left-8" />
          </div>
          <div className="pointer-events-auto">
            <CarouselNext className="relative right-8" />
          </div>
        </div>
      </div>
    </Carousel>
  );
};
