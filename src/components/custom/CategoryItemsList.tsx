import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";

interface CategoryItem {
  _id: string;
  name: string;
  image_url: string;
  slug: string;
}

interface CategoryItemsListProps {
  category: string;
}

const getCategoryItems = async (category: string) => {
  const response = await axios.get(`/api/get-category/items/${category}`);
  return response.data;
};

const CategoryItemCard = ({ item }: { item: CategoryItem }) => {
  return (
    <div className="relative group">
      <img
        src={item.image_url}
        alt={item.name}
        className="w-full filter grayscale transition-all duration-300 group-hover:grayscale-0"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="font-light">{item.name}</p>
      </div>
    </div>
  );
};

export const CategoryItemsList = ({ category }: CategoryItemsListProps) => {
  const { data } = useQuery({
    queryKey: ["categoryItems", category],
    queryFn: () => getCategoryItems(category),
  });

  console.log(data);

  const { firstColumn, secondColumn, thirdColumn } = useMemo(() => {
    if (!data?.categoryItems) {
      return { firstColumn: [], secondColumn: [], thirdColumn: [] };
    }

    const first: CategoryItem[] = [];
    const second: CategoryItem[] = [];
    const third: CategoryItem[] = [];

    data.categoryItems.forEach((item: CategoryItem, index: number) => {
      const columnIndex = index % 3;
      if (columnIndex === 0) {
        first.push(item);
      } else if (columnIndex === 1) {
        second.push(item);
      } else if (columnIndex === 2) {
        third.push(item);
      }
    });

    return {
      firstColumn: first,
      secondColumn: second,
      thirdColumn: third,
    };
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="flex flex-col gap-4">
        {firstColumn &&
          firstColumn.map((item: CategoryItem) => (
            <CategoryItemCard key={item._id} item={item} />
          ))}
      </div>
      <div className="flex flex-col gap-4">
        {secondColumn &&
          secondColumn.map((item: CategoryItem) => (
            <CategoryItemCard key={item._id} item={item} />
          ))}
      </div>
      <div className="flex flex-col gap-4">
        {thirdColumn &&
          thirdColumn.map((item: CategoryItem) => (
            <CategoryItemCard key={item._id} item={item} />
          ))}
      </div>
    </div>
  );
};
