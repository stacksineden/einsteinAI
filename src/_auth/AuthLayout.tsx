import { Outlet } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";

const AuthLayout = () => {
  return (
    <section className="flex h-screen">
      <div className="w-full h-screen bg-black hidden xl:flex flex-1 items-center px-5">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-5xl text-primary-blue">
            Craft and Develop
          </h1>
          <p className="text-white text-4xl font-medium">
            <Typewriter
              words={[
                "a Quantum Physics Quiz",
                "Captivating Travel Headlines",
                "personalized pre and post-workout meals",
                "Compelling Ad Copy for Luxury Watches",
                "a detailed low-carb grocery shopping list",
              ]}
              loop={5}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </p>
        </div>
      </div>
      <section className="flex flex-1 justify-center items-center flex-col py-10">
        <Outlet />
      </section>
    </section>
  );
};

export default AuthLayout;
