import { Heart } from "lucide-react";

const Favourites = () => {
  // const hasFavourites = false;
  const toggleFavourites = () => {};
  return (
    <div
      onClick={toggleFavourites}
      className="relative hover:opacity-80 transition cursor-pointer"
    >
      <Heart />
    </div>
  );
};

export default Favourites;

// type FavouritesProps = {
//   assistantId: string;
// };
