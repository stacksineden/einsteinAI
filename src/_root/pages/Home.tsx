import { useEffect, useRef, useState } from "react";
import { Models } from "appwrite";
import EmptyComponent from "@/components/shared/EmptyComponent";
import { useAssistantCategoryContext } from "@/context/AssistantCategoryContext";
import { useUserContext } from "@/context/AuthContext";
import {
  AssistantModel,
  catergories,
  dataSet,
  tools_dataset,
} from "@/modelDataset";
import { CardStack } from "@/components/shared/cardStack";
import Slider from "@/components/shared/Slider";
import { FreeMode, Mousewheel } from "swiper/modules";
import Categories from "@/components/shared/Categories";
import {
  Sparkles,
  Facebook,
  Instagram,
  Twitter,
  LogOut,
  Loader2,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import ToolsSlider from "@/components/shared/ToolsSlider";
import { useNavigate } from "react-router-dom";
import {
  useGetUserAssistants,
  useGetUserVectorStoreDetails,
  useSignOutAccount,
} from "@/lib/tanstack-query/queriesAndMutation";
import toast from "react-hot-toast";
import EinsteinGptModal from "@/components/shared/EinsteinGptModal";

const Home = () => {
  const navigate = useNavigate();

  const { assistantCategory } = useAssistantCategoryContext();
  const { user, checkAuthUser, userSubscriptionDetails } = useUserContext();

  const { mutateAsync: signOut, isPending: isSigningOut } = useSignOutAccount();

  const { data: assistants } = useGetUserAssistants(user?.id);

  const { data: vectorStore } = useGetUserVectorStoreDetails(user?.id);

  const gptAssistant = assistants?.documents?.filter(
    (assistant: Models.Document) => assistant?.role === "einsteinGPT"
  );

  const [category, setCategory] = useState(() => {
    const storedCategory = localStorage.getItem("currentCategory");
    const lastChange = localStorage.getItem("lastChangeTimestamp");
    if (storedCategory && lastChange) {
      const lastChangeDate = new Date(parseInt(lastChange));
      const now = new Date();
      const diffInDays = Math.floor(
        (now.getTime() - lastChangeDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffInDays < 1) {
        return storedCategory;
      }
    }
    return "Lifestyle and Social media";
  });

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    checkAuthUser();
  }, []);

  // useEffect(() => {
  //   if (!userSubscriptionDetails?.is_subscribed) {
  //     setOpenPaymentModal(true);
  //   }
  //   setOpenPaymentModal(false);
  // }, [userSubscriptionDetails]);

  // get highlighted assistats
  const highLightAssistant = dataSet?.filter(
    (assistant) =>
      assistant?.isHighlight === true && assistant?.classifier === "assistant"
  );

  // Split the highlightAssistant array into two halves
  const midIndex = Math.floor(highLightAssistant.length / 2);
  const firstHalf = highLightAssistant.slice(0, midIndex);
  const secondHalf = highLightAssistant.slice(midIndex);

  // get highlighted agents
  const highlightedAgent = dataSet?.filter(
    (assistant) =>
      assistant?.isHighlight === true && assistant?.classifier === "agent"
  );

  // get todays needs for assistants

  const [todayAssistants, setTodayAssistants] = useState<AssistantModel[]>([]);

  // basically to get assistants within categories that will change every 24 hours
  function getTodayNeedsAssistants(category: string) {
    return dataSet?.filter(
      (assistant) =>
        assistant?.category === category.toLowerCase() &&
        assistant?.classifier === "assistant"
    );
  }

  useEffect(() => {
    const updateCategory = () => {
      setCategory((prevCategory) => {
        const currentIndex = catergories.indexOf(prevCategory);
        const nextIndex = (currentIndex + 1) % catergories.length;
        const newCategory = catergories[nextIndex];
        localStorage.setItem("currentCategory", newCategory);
        localStorage.setItem("lastChangeTimestamp", Date.now().toString());
        return newCategory;
      });
    };

    const intervalId = setInterval(() => {
      const lastChange = localStorage.getItem("lastChangeTimestamp");
      if (lastChange) {
        const lastChangeDate = new Date(parseInt(lastChange));
        const now = new Date();
        const diffInDays = Math.floor(
          (now.getTime() - lastChangeDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffInDays >= 1) {
          updateCategory();
        }
      } else {
        updateCategory();
      }
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const results = getTodayNeedsAssistants(category);
    setTodayAssistants(results);
  }, [category]);

  // featured AI agents
  const featuredAgents = dataSet
    ?.filter((item) => item?.level === "Maestro")
    .reverse();

  const filteredAssistants = assistantCategory
    ? dataSet?.filter((item) => item?.category === assistantCategory)
    : dataSet;

  if (!filteredAssistants || filteredAssistants.length === 0) {
    return <EmptyComponent />;
  }

  const handleSignOut = async () => {
    const response = await signOut();
    if (response) {
      toast.success("Logout successful!");
      navigate("/sign-in");
    }
    if (response instanceof Error) {
      // Assuming err.message contains the API error message
      return toast.error(response?.message || "Sign out, please try again.");
    }
  };

  return (
    <div className="h-full">
      <div className="flex h-full w-full flex-col justify-between px-4 sm:px-8 pt-6">
        <div className="max-w-7xl self-center w-full">
          <div className="flex justify-end items-end md:justify-between pr-4">
            {/* {isEmailVerified && (
              <div className="p-2 w-full md:w-1/2 fixed top-4 left-0 md:left-[35%] text-center text-sm rounded-xl text-zinc-300 border border-zinc-700">
                <span className="underline text-primary-blue font-medium tracking-wide">
                  {" "}
                  Verification Email Sent!
                </span>{" "}
                Please check your inbox to verify your email
              </div>
            )} */}
            {/* {userSubscriptionDetails?.is_subscribed && (
              <div className="p-2 w-full md:w-1/2 fixed top-4 left-0 md:left-[35%] text-center text-sm rounded-xl text-zinc-300 border border-zinc-700">
                Access to EinsteinGPT and Agents is available only on the Pro
                Plan. Only Free Agents are available on the Free Plan.
              </div>
            )} */}
            <div className="hidden md:flex flex-col gap-2">
              <p className="text-zinc-400 text-base font-normal">
                Welcome back,
              </p>
              <div className="flex">
                <div className="h-[30px] w-[30px] flex items-center justify-center rounded-full mx-1">
                  <img
                    src={
                      user?.imageUrl ||
                      "/assets/images/assistants/placeholder.png"
                    }
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="text-xl text-zinc-100 flex flex-auto flex-col justify-center text-left ml-1">
                  <p>{user?.name?.split(" ")[1]}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between ml-6 items-center">
              {gptAssistant && gptAssistant?.length > 0 ? (
                <div className="relative h-10 w-64 md:w-96 rounded-3xl flex justify-center gap-2 items-center">
                  <Switch
                    className="bg-primary-blue"
                    onCheckedChange={() => {
                      // setIsGpt(true),
                      navigate(
                        `/einsteingpt/${gptAssistant?.[0]?.assistant_id}`
                      );
                    }}
                    // checked={!!gptAssistant}
                  />
                  <p className="text-zinc-100 text-xs md:text-sm">
                    Switch to Einstein
                    <span className="font-semibold text-primary-blue text-base">
                      GPT
                    </span>
                  </p>
                </div>
              ) : (
                <EinsteinGptModal
                  is_subscribed={userSubscriptionDetails?.is_subscribed}
                />
              )}
              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={handleSignOut}
              >
                {isSigningOut ? (
                  <Loader2 className="h-4 w-4 md:h-6 md:w-6 text-blue-500 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4 md:h-6 md:w-6 text-zinc-100" />
                )}
                <p className="text-zinc-100 text-xs md:text-sm font-medium">
                  {isSigningOut ? "Loging out" : "Log out"}
                </p>
              </div>
            </div>
          </div>

          <ol className="flex flex-col pt-6">
            <div className="pl-2 md:pl-0">
              <div className="hidden md:black rounded-3xl gap-10 bg-black items-center justify-between xl:flex my-6 relative h-[330px] overflow-hidden w-full min-w-[400px]">
                <div className="overflow-hidden h-full w-[400px] rounded-3xl relative flex-1">
                  <img
                    src="/assets/images/appbanner.jpg"
                    alt=""
                    className="hero_img"
                  />
                  <div className="text-white z-50 absolute top-8 left-4 flex flex-col gap-1">
                    <p className="text-zinc-200 text-base font-medium">
                      What do you want to do today?
                    </p>
                    <p className="text-3xl font-medium text-zinc-100">
                      Discover something new
                    </p>
                  </div>
                </div>

                <div className="bg-transparent h-full w-full flex-1 p-4">
                  <div className="grid grid-cols-2 gap-3 w-full h-full">
                    <CardStack
                      items={firstHalf}
                      vector_store_id={
                        vectorStore?.documents[0]?.vector_store_id
                      }
                    />
                    <CardStack
                      items={secondHalf}
                      vector_store_id={
                        vectorStore?.documents[0]?.vector_store_id
                      }
                    />
                  </div>
                </div>
              </div>

              {/* First Slider */}

              {/* // just for users that have created assistants before */}
              <li className="mb-6">
                <div className="h-full w-full">
                  <div className="mb-4 ml-4">
                    <p className="text-lg font-medium text-zinc-100">For You</p>
                  </div>
                  <div className="my-2 md:my-4 relative w-full">
                    <Slider
                      key="slider1"
                      modules={[FreeMode, Mousewheel]}
                      data={highlightedAgent}
                      vector_store_id={
                        vectorStore?.documents[0]?.vector_store_id
                      }
                    />
                  </div>
                </div>
              </li>

              {/* Second Slider */}
              <li className="mb-6">
                <div className="h-full w-full">
                  <div className="mb-4 ml-4">
                    <p className="text-lg font-medium text-zinc-100">
                      Today&apos;s Aides :{" "}
                      <span className="text-primary-blue">{category}</span>
                    </p>
                  </div>
                  <div className="my-2 md:my-4 relative w-full">
                    <Slider
                      key="slider2"
                      modules={[FreeMode, Mousewheel]}
                      data={todayAssistants}
                      vector_store_id={
                        vectorStore?.documents[0]?.vector_store_id
                      }
                    />
                  </div>
                </div>
              </li>

              {/* Third Slider */}
              <div className="w-full flex flex-col gap-4 mb-4">
                <p className="ml-4 text-lg font-medium text-zinc-100">
                  Try These <span className="text-primary-blue">GPTs</span>
                </p>
                <div className="relative group w-full flex">
                  <ToolsSlider
                    key="slider3"
                    modules={[FreeMode, Mousewheel]}
                    data={tools_dataset}
                    vector_store_id={vectorStore?.documents[0]?.vector_store_id}
                  />
                </div>
              </div>
              {/* fourth slider */}
              <li className="mb-6">
                <div className="h-full w-full">
                  <div className="mb-4 ml-4">
                    <p className="text-lg font-medium text-zinc-100">
                      Featured
                    </p>
                  </div>
                  <div className="my-2 md:my-4 relative w-full">
                    <Slider
                      key="slider4"
                      modules={[FreeMode, Mousewheel]}
                      data={featuredAgents}
                      vector_store_id={
                        vectorStore?.documents[0]?.vector_store_id
                      }
                    />
                  </div>
                </div>
              </li>
              {/* fifth slider */}

              <div className="w-full flex flex-col mt-7 mb-4">
                {/* nav items  */}
                <div className="w-[95%] md:w-[99%] mx-auto">
                  <Categories />
                </div>
                <div className="h-full w-full">
                  <div className="my-4 relative w-full">
                    <Slider
                      key="slider5"
                      modules={[FreeMode, Mousewheel]}
                      data={filteredAssistants}
                      vector_store_id={
                        vectorStore?.documents[0]?.vector_store_id
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col items-center justify-center my-10 px-4 md:px-0">
                <div className="w-full flex justify-center">
                  <motion.div
                    className="w-[500px] relative"
                    ref={ref}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isInView ? 1 : 0 }}
                    transition={{ duration: 1 }}
                  >
                    <div className="w-full flex flex-col gap-3">
                      <motion.img
                        src="/assets/images/enterprisebg.png"
                        alt="background"
                        className="cover w-full h-full"
                        loading="lazy"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: isInView ? 1 : 0,
                          y: isInView ? 0 : 20,
                        }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                      <motion.div
                        className="w-full py-5 flex flex-col gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isInView ? 1 : 0 }}
                        transition={{ duration: 1, delay: 1 }}
                      >
                        <h4 className="text-3xl md:text-4xl text-zinc-100 font-medium">
                          Create your own{" "}
                          <span className="text-primary-blue">Virtuosos</span>
                        </h4>
                        <p className="text-xs md:text-sm text-zinc-100 opacity-70">
                          Create Specialised assistants for your business needs.
                          Unlock the ability to create these advanced assistants
                          by upgrading to our enterprise plan.
                        </p>
                        <motion.div
                          className="mt-3 flex items-center justify-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{
                            opacity: isInView ? 1 : 0,
                            y: isInView ? 0 : 10,
                          }}
                          transition={{ duration: 1, delay: 1.5 }}
                        >
                          <motion.button
                            className="bg-zinc-700 text-zinc-100 rounded-md px-4 py-2 flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/create-assistant")}
                          >
                            <Sparkles className="text-zinc-100 mr-2" />
                            Create an Assistant
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </ol>
        </div>
        {/* footer */}
        <div className="w-full bg-zinc-900 border-t border-t-zinc-800">
          <div className="px-2 lg:px-32 py-4 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 border-t-[1px] border-zinc-800 space-y-2 md:space-y-1">
            <div className="flex items-center space-x-1 md:space-x-2">
              <p className="text-xs text-zinc-100">English (US)</p>
              <p className="text-xs text-zinc-100">USD</p>
              <div className="flex items-center space-x-1">
                <Instagram className="w-5 h-5 text-zinc-100 cursor-pointer" />
                <Facebook className="w-5 h-5 text-zinc-100 cursor-pointer" />
                <Twitter className="w-5 h-5 text-zinc-100 cursor-pointer" />
              </div>
            </div>
            <div className="flex items-center space-x-3 md:space-x-4">
              <p className="text-xs text-zinc-100 cursor-pointer">Privacy</p>
              <p className="text-xs text-zinc-100 cursor-pointer">Terms</p>
              <p className="text-xs text-zinc-100 cursor-pointer">
                Help center
              </p>
              <p className="text-xs font-semibold text-zinc-100">
                &copy; {new Date().getFullYear()} StacksinEden inc
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
