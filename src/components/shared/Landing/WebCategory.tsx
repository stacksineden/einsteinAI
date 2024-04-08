import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import VideoCarousel from "./VideoCarousel";


const WebCategory = () => {
  useGSAP(() => {
    gsap.to("#title", { opacity: 1, y: 0 });
    gsap.to("#link", { opacity: 1, y: 0, duration: 1, stagger: 0.25 });
  }, []);

  return (
    <section
      id="#highlights"
      className="w-screen overflow-hidden h-full py-10 sm:px-10 px-5 bg-light-grey"
    >
      <div className="screen-max-width">
        <div className="mb-5 w-full md:flex items-end justify-between">
          <h1
            id="title"
            className="text-black lg:text-5xl md:text-5xl text-2xl lg:mb-0 mb-3 ml-1 md:ml-7 opacity-0 translate-y-20 w-[80%] md:w-[40%]"
          >
            Getting Started with{" "}
            <span className="text-primary-blue">EinstenAI</span>
          </h1>
        </div>
        <VideoCarousel />
      </div>
    </section>
  );
};

export default WebCategory;
