import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwiper } from "swiper/react";

const CarouselButtons = () => {
  const swiper = useSwiper();
  return (
    <>
      <div
        className="hidden lg:flex items-center justify-between absolute top-0 left-0 text-zinc-100 z-40 h-full bg-black cursor-pointer p-4 opacity-30"
        onClick={() => swiper.slidePrev()}
      >
        <ChevronLeft className="text-zinc-100 h-7 w-7" />
      </div>
      <div
        className="hidden lg:flex items-center justify-between absolute top-0 right-0 text-zinc-100 z-40 h-full bg-zinc-900 cursor-pointer p-4 opacity-60"
        onClick={() => swiper.slideNext()}
      >
        <ChevronRight className="text-zinc-100 h-7 w-7" />
      </div>
    </>
  );
};

export default CarouselButtons;
