import { Card, CardHeader, CardTitle } from "../ui/card";

export const FurnitureCard = ({
  title,
  imageUrl,
  altText,
}: {
  title: string;
  imageUrl: string;
  altText: string;
}) => {
  return (
    <div className="group cursor-pointer">
      <Card className="overflow-hidden transition-all duration-300 group-hover:scale-105 shadow-none border-none rounded-none bg-transparent">
        <div className="relative">
          <img
            src={imageUrl}
            alt={altText}
            className="w-full h-auto filter grayscale transition-all duration-300 group-hover:grayscale-0"
          />
        </div>
        <CardHeader className="py-2 bg-transparent">
          <CardTitle className="text-center text-lg font-light">
            {title}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

type FurnitureCategory = {
  title: string;
  imageUrl: string;
  altText: string;
};

const furnitureCategories: FurnitureCategory[] = [
  {
    title: "Кухни на заказ",
    imageUrl: "/categories/sofa.jpg",
    altText: "Sofas",
  },
  {
    title: "Мебель для кафе, баров, ресторанов",
    imageUrl: "/categories/sofa.jpg",
    altText: "Beds",
  },
  {
    title: "Мебель лофт",
    imageUrl: "/categories/sofa.jpg",
    altText: "Chairs",
  },
];

export const FurnitureCategoriesList = ({
  items,
}: {
  items?: FurnitureCategory[];
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 px-4">
      {(items ?? furnitureCategories).map((category) => (
        <FurnitureCard key={category.title} {...category} />
      ))}
    </div>
  );
};
