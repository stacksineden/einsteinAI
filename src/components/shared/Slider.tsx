import { Swiper, SwiperSlide } from "swiper/react";
import CarouselButtons from "./CarouselButtons";
import AgentCard from "./AgentCard";
import { AssistantModel } from "@/modelDataset";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";


type SliderProps = {
  key: string;
  modules: any[];
  data: AssistantModel[]; 
  vector_store_id:string;
};

const Slider = ({ key, modules, data, vector_store_id }: SliderProps) => {
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
          slidesPerView: 1,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 10,
        },
      }}
      // onSwiper={(swiper) => console.log(swiper)}
      // onSlideChange={() => console.log("slide change")}
    >
      {data &&
        data?.map((assistant) => (
          <SwiperSlide className="swiper-slide" key={assistant?.id}>
            <AgentCard assistant={assistant} vector_store_id={vector_store_id}/>  
          </SwiperSlide>
        ))}
      <CarouselButtons />
    </Swiper>
  );
};

export default Slider;
