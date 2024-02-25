import WebFooter from "./WebFooter";
import WebNavBar from "./WebNavBar";

const WebLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
     <WebNavBar/>
      <div className="relative overflow-hidden">{children}</div>
      <WebFooter />
    </>
  );
};

export default WebLayoutWrapper;
