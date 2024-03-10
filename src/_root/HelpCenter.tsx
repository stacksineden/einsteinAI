import WebLayoutWrapper from "@/components/shared/Landing/WebLayoutWrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/modelDataset";

const HelpCenter = () => { 
  return (
    <WebLayoutWrapper>
      <div className="mx-auto max-w-[1440px] px-5 md:px-20 py-20">
        <div className="text-center flex flex-col gap-1 md:gap-2">
          <div className="max-w-[80%] mx-auto py-2">
            <h2 className="font-medium text-[24px] md:text-[40px] text-primary-black max-w-[98%] md:max-w-[70%] mx-auto">
              Help Center: Discover How
              <span className="text-primary-blue"> EinsteinAI</span> Works.
            </h2>
          </div>
          <div className="text-primary-black text-sm md:text-base w-[90%] md:w-[70%] mx-auto opacity-80">
            Explore our Frequently Asked Questions to get a comprehensive
            understanding of our platform's features, functionality, and how it
            can simplify your experience.
          </div>
        </div>

        <div className="w-full md:w-[85%] mx-auto mt-4">
          <Accordion type="single" collapsible>
            {faqs &&
              faqs?.map((faq, _i) => (
                <AccordionItem value={faq.key} key={_i}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      </div>
    </WebLayoutWrapper>
  );
};

export default HelpCenter;
