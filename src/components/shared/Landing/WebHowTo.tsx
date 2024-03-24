import { MoveRight } from "lucide-react";

type CategoryCardType = {
  image: string;
  name: string;
};

const CategoryCard = ({ image, name }: CategoryCardType) => {
  return (
    <div className="hover:scale-105 transform transition duration-300 ease-out">
      <div className="relative h-80 w-64">
        <img
          src={image}
          alt="catergories"
          className="object-cover rounded-xl w-full h-full"
          loading="lazy"
        />
      </div>
      <h3 className="text-base text-primary-balck mt-2">{name}</h3>
    </div>
  );
};

const WebHowTo = () => {
  return (
    <section className="2xl:max-w-[1440px] mx-auto relative py-4 lg:mb-5 lg:py-10 xl:mb-6 px-6 lg:px-20 3xl:px-0 overflow-hidden bg-feature-bg bg-center bg-no-repeat">
      <h2 className="lg:text-5xl md:text-5xl text-2xl lg:mb-0 mb-5  text-black w-860%] md:w-[40%]">
        Get Better Results with{" "}
        <span className="text-primary-blue">Real-World Use Cases</span>
      </h2>
      <div className="flex space-x-4 overflow-scroll p-3 -ml-3 scrollbar-hide mt-0 md:mt-7">
        {serviceCategory?.map((category, _i) => (
          <CategoryCard key={_i} image={category?.img} name={category?.name} />
        ))}
      </div>
    </section>
  );
};

export default WebHowTo;

export const serviceCategory = [
  {
    img: "/assets/images/service-catergories/writing.webp",
    name: "Copywriting",
  },
  {
    img: "/assets/images/service-catergories/marketing.webp",
    name: "Email Marketing",
  },
  {
    img: "/assets/images/service-catergories/nutrition.webp",
    name: "Diet Coaching",
  },
  {
    img: "/assets/images/service-catergories/translation.webp",
    name: "Translation",
  },
  {
    img: "/assets/images/service-catergories/tech.webp",
    name: "Programming",
  },
  {
    img: "/assets/images/service-catergories/business.webp",
    name: "Business",
  },
  {
    img: "/assets/images/service-catergories/education.webp",
    name: "Tutoring",
  },
  {
    img: "/assets/images/service-catergories/fitness.webp",
    name: "Fitness Coaching",
  },
  {
    img: "/assets/images/service-catergories/health.webp",
    name: "Health",
  },
  {
    img: "/assets/images/service-catergories/social-media.webp",
    name: "Social Media",
  },
  {
    img: "/assets/images/service-catergories/lifestyle.webp",
    name: "Lifestyle Coaching",
  },
];

// <p className="text-base md:text-lg text-primary-black w-full md:w-1/2 opacity-70">
// Whether you want to find assistants, have them come to you, or
// collaborate with your entire team, get started in just a few clicks.
// </p>
// <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-8">
// <div className="py-7 md:py-12 px-3 md:px-7 flex items-center gap-3 hover:scale-105 transform transition duration-300 ease-out cursor-pointer rounded-xl text-center shadow-lg md:rounded-3xl border border-primary-blue bg-blue-50">
//   <p className="text-primary-black text-lg md:text-2xl flex-1">
//     Select any Pre-Trained Assistant
//   </p>
//   <MoveRight className="text-primary-black h-7 w-7 md:block hidden" />
// </div>
// <div className="py-7 md:py-12 px-3 md:px-7 flex items-center gap-3 hover:scale-105 transform transition duration-300 ease-out cursor-pointer rounded-xl text-center shadow-lg md:rounded-3xl border border-primary-red bg-red-50">
//   <p className="text-primary-black text-lg md:text-2xl flex-1">
//   Train and Configure for your use-case
//   </p>
//   <MoveRight className="text-primary-black h-7 w-7 md:block hidden" />
// </div>
// <div className="py-7 md:py-12 px-3 md:px-7 flex items-center gap-3 hover:scale-105 transform transition duration-300 ease-out cursor-pointer rounded-xl text-center shadow-lg md:rounded-3xl border border-primary-yellow bg-yellow-50">
//   <p className="text-primary-black text-lg md:text-2xl flex-1">
//   Chat with Your Trained Assistant
//   </p>
//   <MoveRight className="text-primary-black h-7 w-7 md:block hidden" />
// </div>
// </div>
