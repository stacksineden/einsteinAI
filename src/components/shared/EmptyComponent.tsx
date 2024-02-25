import { Button } from "../ui/button";
import Heading from "./Heading";

const EmptyComponent = ({
  title = "No exact Matches",
  subtitle = "Try changing or removing fiters",
  showReset,
}: EmptyComponentProps) => {
  return (
    <div className="h-[80vh] flex flex-col gap-2 justify-center items-center">
      <Heading center title={title} subtitle={subtitle} />{" "}
      <div className="w-48 mt-4 flex justify-center">
        {!showReset && <Button  variant="outline">Remove All filters</Button>}  
      </div>
    </div>
  );
};

export default EmptyComponent;

type EmptyComponentProps = {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
};
