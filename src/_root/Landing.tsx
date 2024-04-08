import WebAssistant from "@/components/shared/Landing/WebAssistant";
import WebCategory from "@/components/shared/Landing/WebCategory";
import WebDemo from "@/components/shared/Landing/WebDemo";
import WebEnterPrise from "@/components/shared/Landing/WebEnterPrise";
import WebFeatures from "@/components/shared/Landing/WebFeatures";
import WebHero from "@/components/shared/Landing/WebHero";
import WebHowTo from "@/components/shared/Landing/WebHowTo";
import WebLayoutWrapper from "@/components/shared/Landing/WebLayoutWrapper";

const Landing = () => {
  return (
    <WebLayoutWrapper>
      <>
        <WebHero />
        <WebDemo />
        <WebCategory />
        <WebHowTo />
        <WebFeatures />
        <WebEnterPrise />
        <WebAssistant />
      </>
    </WebLayoutWrapper>
  );
};

export default Landing;
