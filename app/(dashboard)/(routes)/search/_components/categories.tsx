"use client";

import { Category } from "@prisma/client";
import { IconType } from "react-icons";
import { FaAssistiveListeningSystems } from "react-icons/fa";
import { RiUserVoiceLine } from "react-icons/ri";
import { TfiWrite } from "react-icons/tfi";
import { BiBookReader } from "react-icons/bi";
import { CategoryItem } from "./category-item";

interface CategoryProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  Listening: FaAssistiveListeningSystems,
  Speaking: RiUserVoiceLine,
  Writing: TfiWrite,
  Reading: BiBookReader,
};

const Categories = ({ items }: CategoryProps) => {
  return (
    <div className="flex items-center justify-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
};

export default Categories;
