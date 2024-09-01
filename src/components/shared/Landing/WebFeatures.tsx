import { WobbleCard } from "./WobbleCard";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function FeaturesSectionDemo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <div className="py-10 bg-zinc-950 w-full">
      <motion.div
        ref={ref}
        className="2xl:max-w-[1440px] mx-auto relative py-4 lg:mb-5 lg:py-10 xl:mb-6 px-5 lg:px-20 3xl:px-0 overflow-hidden w-full md:w-[80%] font-medium"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isInView ? 1 : 0,
          y: isInView ? 0 : 20,
        }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <h2 className="text-4xl md:text-5xl text-zinc-100 tracking-wide">
          Powerful Features of{" "}
          <span className="text-primary-blue"> EinsteinAI</span> for an
          Unmatched AI Chat Experience.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full my-8">
        <WobbleCard
          containerClassName="col-span-1 lg:col-span-2 h-full bg-black min-h-[500px] lg:min-h-[300px]"
          // className=""
        >
          <div className="max-w-xs">
            <h2 className="text-left text-balance text-3xl md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-zinc-100">
              Instant, Real-Time Search
            </h2>
            <p className="mt-2 md:mt-4 text-left text-base text-zinc-100 md:tracking-wide">
              Get fast, accurate, and up-to-date responses with EinsteinAI's
              advanced real-time search capabilities, powered by cutting-edge
              web integration—ensuring you always have the most current
              information at your fingertips, eliminating guesswork and outdated
              data.
            </p>
          </div>
          <img
            src="/assets/images/search-google.png"
            width={500}
            height={500}
            alt="linear demo image"
            className="absolute -right-4 lg:-right-[20%] -bottom-24 md:-bottom-10 object-contain rounded-2xl"
          />
        </WobbleCard>
        <WobbleCard containerClassName="col-span-1 min-h-[300px]">
          <h2 className="max-w-80 text-left text-balance text-3xl md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Lightweight, Fast, and Affordable.
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
            Get the best of AI without breaking the bank. EinsteinAI is designed
            to be fast and accessible for everyone.
          </p>
        </WobbleCard>
        <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-black min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
          <div className="max-w-sm">
            <h2 className="max-w-sm md:max-w-lg text-left text-balance text-3xl md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Chat with PDFs, Websites and other documents.
            </h2>
            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
              Effortlessly chat with PDFs, websites, and more—simply drag and
              drop documents or links into EinsteinAI's chat interface for quick
              summaries and insights, whether it's a PDF, Word document,
              webpage, or blog article.
            </p>
          </div>
          <img
            src="/assets/images/chat-pdf.webp"
            width={500}
            height={500}
            alt="linear demo image"
            className="absolute -right-10 md:-right-[40%] lg:-right-[5%] -bottom-2 object-contain rounded-2xl"
          />
        </WobbleCard>
        <WobbleCard
          containerClassName="col-span-1 lg:col-span-2 h-full bg-black min-h-[500px] lg:min-h-[300px]"
          className=""
        >
          <div className="max-w-xs">
            <h2 className="text-left text-balance text-3xl md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Advanced Data Access and Retrieval.
            </h2>
            <p className="mt-4 text-left text-base/6 text-neutral-200">
              Unlock powerful capabilities like web scraping, Google search,
              YouTube data extraction, TripAdvisor insights, and rapid file
              search—all integrated seamlessly into one platform for enhanced
              efficiency.
            </p>
          </div>
          <img
            src="https://st4.depositphotos.com/10425000/20841/i/600/depositphotos_208410422-stock-photo-sankt-petersburg-russia-august-2018.jpg"
            width={500}
            height={500}
            alt="linear demo image"
            className="absolute -right-4 lg:-right-[20%] -bottom-20 object-contain rounded-2xl"
          />
          x
        </WobbleCard>
        <WobbleCard containerClassName="col-span-1 min-h-[300px]">
          <h2 className="max-w-80 text-left text-balance text-3xl md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Multimodal Processing.
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
            Provide text or images—EinsteinAI effortlessly handles both,
            delivering versatile outputs tailored to your specific needs.
          </p>
        </WobbleCard>
        <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-black min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
          <div className="max-w-sm">
            <h2 className="max-w-sm md:max-w-lg text-left text-balance text-3xl md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Interact with Images, Create AI-Generated Visuals.
            </h2>
            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
              Subheading: Effortlessly chat with your images and generate
              stunning AI visuals. Upload images to EinsteinAI and leverage
              GPT-4 Vision for instant analysis, answers,
              and content creation. Transform ideas into captivating visuals
              that elevate your brand, powered by DALL-E 3.
            </p>
          </div>
          <img
            src="https://cdn.pixabay.com/photo/2014/12/23/17/43/lichtspiel-578621_1280.jpg"
            width={500}
            height={500}
            alt="linear demo image"
            className="absolute -right-10 md:-right-[40%] lg:-right-[5%] -bottom-[250px] md:-bottom-32 object-contain rounded-2xl"
          />
        </WobbleCard>
      </div>
    </div>
  );
}
