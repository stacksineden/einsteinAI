type CategoryCardType = {
  image: string;
  name: string;
};

const CategoryCard = ({ image, name }: CategoryCardType) => {
  return (
    <div className="hover:scale-105 transform transition duration-300 ease-out">
      <div className="relative h-60 w-60">
        <img
          src={image}
          alt="catergories"
          className="object-cover rounded-xl w-full h-full"
          loading="lazy"
        />
      </div>
      <h3 className="text-base text-primary-balck mt-2">
        {name}
      </h3>
    </div>
  );
};

const WebCategory = () => {
  return (
    <section className="2xl:max-w-[1440px] mx-auto relative flex flex-col py-1 lg:mb-5 lg:py-2 xl:mb-6 px-6 lg:px-20 3xl:px-0">
      <h2 className="text-[24px] md:text-[40px] opacity-70 pb-1 md:pb-3">
        Need Help with
      </h2>
      <div className="flex space-x-4 overflow-scroll p-3 -ml-3 scrollbar-hide">
        {serviceCategory?.map((category, _i) => (
          <CategoryCard key={_i} image={category?.img} name={category?.name} />
        ))}
      </div>
    </section>
  );
};

export default WebCategory;

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
