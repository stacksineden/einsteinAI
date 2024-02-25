import WebAssistant from "@/components/shared/Landing/WebAssistant";
import WebCategory from "@/components/shared/Landing/WebCategory";
import WebHero from "@/components/shared/Landing/WebHero";
import WebHowTo from "@/components/shared/Landing/WebHowTo";
import WebLayoutWrapper from "@/components/shared/Landing/WebLayoutWrapper";

const Landing = () => {
  return (
    <WebLayoutWrapper>
      <>
        <WebHero />
        <WebCategory />
        <WebHowTo />
        <WebAssistant />
      </>
    </WebLayoutWrapper>
  );
};

export default Landing;
