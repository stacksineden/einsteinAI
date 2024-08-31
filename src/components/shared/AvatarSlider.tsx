import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
import CarouselButtons from "./CarouselButtons";
import { emojiDictionaryType } from "@/modelDataset";
import { useAssistantCategoryContext } from "@/context/AssistantCategoryContext";

type AvatarSliderProps = {
  key: string;
  modules: any[];
  data: emojiDictionaryType[];
};

const AvatarSlider = ({ key, modules, data }: AvatarSliderProps) => {
  const { selectedAvatar, setSelectedAvatar } = useAssistantCategoryContext();
  return (
    <Swiper
      modules={modules}
      spaceBetween={10}
      slidesPerView={4}
      mousewheel={true}
      freeMode={true}
      watchSlidesProgress={true}
      key={key}
      breakpoints={{
        320: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 5,
          spaceBetween: 10,
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 10,
        },
      }}
    >
      {data &&
        data?.map((assistant, _i) => (
          <SwiperSlide className="swiper-slide" key={_i}>
            <div
              className={`h-[120px] md:h-[146px] w-full rounded-xl cursor-pointer ${
                selectedAvatar === assistant?.name
                  ? "border border-zinc-500 bg-zinc-500"
                  : "border-transparent bg-zinc-800"
              }`}
              onClick={() => setSelectedAvatar(assistant?.name)}
            >
              <img
                src={assistant?.imageUrl}
                alt="assistantimage"
                className="h-full w-full object-contain rounded-xl"
              />
            </div>
          </SwiperSlide>
        ))}
      <CarouselButtons />
    </Swiper>
  );
};

export default AvatarSlider;
