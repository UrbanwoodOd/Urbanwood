import { FurnitureCategoriesList } from "../custom/FurnitureCategoriesList";

const categories = {
  bedroom: {
    title: "Мебель для спальни",
    items: [
      {
        title: "Спальня с реечной стеной",
        imageUrl: "/mebel_dlya_spalni_13.jpg",
        altText: "Спальня с реечной стеной",
      },
    ],
  },
};

export const PortfolioPage = ({ category }: { category: string }) => {
  return (
    <div className="p-8 pt-4">
      <h2 className="text-2xl font-semibold py-4">
        {categories[category as keyof typeof categories].title}
      </h2>
      <FurnitureCategoriesList
        items={categories[category as keyof typeof categories].items}
      />
    </div>
  );
};
