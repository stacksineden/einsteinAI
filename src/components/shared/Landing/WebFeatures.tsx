import {
  Bot,
  Clock4,
  Workflow,
  File,
  Activity,
  DollarSign,
} from "lucide-react";

type WebFeaturesType = {
  icon: JSX.Element;
  title: string;
  text: string;
};

const WebFeatures = () => {
  return (
    <section className="2xl:max-w-[1440px] mx-auto relative py-4 lg:mb-5 lg:py-10 xl:mb-6 px-6 lg:px-20 3xl:px-0 overflow-hidden">
      <h2 className="lg:text-5xl md:text-5xl text-2xl lg:mb-0 mb-5  text-black w-[80%] md:w-[40%]">
        EinsteinAI Assistants{" "}
        <span className="text-primary-blue">With Stunning Features</span>
      </h2>
      <div className="mt-0 md:mt-7 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {featuresData.map((feature, index) => (
          <div
            key={index}
            className="border border-light-grey rounded-xl h-full py-5 shadow-md flex flex-col gap-3 px-6"
          >
            {feature.icon}
            <h2 className="text-lg font-medium text-primary-black">
              {feature?.title}
            </h2>
            <p className="text-base text-primary-black opacity-70">
              {feature?.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WebFeatures;

export const featuresData: WebFeaturesType[] = [
  {
    icon: <Bot className="h-9 w-9 text-primary-blue" />,
    title: "Specialized Assistants",
    text: "Access a diverse range of trained assistants tailored for specific cases such as copywriting, diet coaching, technical support, and more, ensuring expert assistance that matches individual user needs.",
  },
  {
    icon: <Workflow className="h-9 w-9 text-primary-blue" />,
    title: "Autonomous Actions",
    text: "Assign tasks to the platform's assistants to autonomously carry out specific actions on behalf of the user, streamlining processes and saving time and effort.",
  },
  {
    icon: <Clock4 className="h-9 w-9 text-primary-blue" />,

    title: "Real-Time Data Retrieval",
    text: "Our assistants excel at obtaining real-time data by conducting live searches on behalf of users, providing up-to-date information and insights tailored to specific queries and requirements in the moment.",
  },
  {
    icon: <File className="h-9 w-9 text-primary-blue" />,
    title: "Comprehensive File Training",
    text: "Seamlessly upload and work with a wide range of 37 file types to train your assistants, accommodating various documents and media for versatile and personalized support. Unlock the potential of your assistants with diverse training data for enhanced expertise and adaptability.",
  },
  {
    icon: <Activity className="h-9 w-9 text-primary-blue" />,
    title: "Versatile Task Execution",
    text: "Our assistants are equipped with specialized functions that enable them to handle a wide spectrum of tasks, from simple to highly complex, leveraging their sophisticated capabilities to address diverse user needs with precision and efficiency.",
  },
  {
    icon: <DollarSign className="h-9 w-9 text-primary-blue" />,
    title: "Cost Benefits",
    text: "Enjoy significant cost benefits by leveraging the platform's assistants, eliminating the need for hiring professionals for certain tasks, thereby reducing operational expenses.",
  },
  // Add more feature objects as needed
];
