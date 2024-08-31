import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const WebHowTo = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="2xl:max-w-[1440px] mx-auto relative py-4 lg:mb-5 lg:py-12 xl:mb-6 px-5 lg:px-20 3xl:px-0 overflow-hidden bg-black w-full md:w-[80%] font-medium"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 20,
      }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <h2 className="text-4xl md:text-5xl text-zinc-100 tracking-wide">
        Get instant, fact-checked information with citations in under 5 seconds
        –
        <span className="text-primary-blue"> all at 50% less than ChatGPT.</span>
      </h2>
    </motion.div>
  );
};

export default WebHowTo;


