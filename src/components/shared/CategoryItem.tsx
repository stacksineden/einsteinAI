import { useAssistantCategoryContext } from "@/context/AssistantCategoryContext";

const CategoryItem = ({ Icon, label, value }: CatergoryItemProps) => {
  const { assistantCategory, setAssistantCategory } =
    useAssistantCategoryContext();
  return (
    <div
      className={`flex flex-col justify-center items-center gap-2 p-3 border-b-2 hover:text-primary-blue transition cursor-pointer ${
        assistantCategory === value
          ? "border-b-zinc-800"
          : "border-transparent"
      }
      ${
        assistantCategory === value ? "text-primary-blue" : "text-zinc-100"
      }`}
      onClick={() => setAssistantCategory(value!)}
    >
      {Icon}
      <div className="font-medium text-sm truncate">{label}</div>
    </div>
  );
};

export default CategoryItem;

type CatergoryItemProps = {
  label?: string;
  value?: string;
  Icon?: JSX.Element;
};
