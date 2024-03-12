import { Facebook, Instagram, Twitter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WebFooter = () => {
  const Navigate = useNavigate();
  return (
    <div className="bg-light-grey text-primary-black">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-y-10 px-20 md:px-32 py-14">
        <div className="space-y-4 text-xs text-primary-black cursor-pointer">
          <h5 className="font-bold text-[16px]">ABOUT</h5>
          <p onClick={() => Navigate("/help-center")}>How einsteinAI works</p>
          <p onClick={() => Navigate("https://medium.com/@stacksineden")}>Blog</p>
          <p onClick={() => Navigate("/")}>StacksinEDEN</p> 
          <p onClick={() => Navigate("/")}>FAQs</p>
        </div>
        <div className="space-y-4 text-xs text-primary-black cursor-pointer">
          <h5 className="font-bold text-[16px]">USEFUL LINKS</h5>
          <p onClick={() => Navigate("/help-center")}>Help center</p>
          <p onClick={() => Navigate("/pricing")}>Pricing</p>
          <p onClick={() => Navigate("/app")}>Train Assistants</p>
          <p onClick={() => Navigate("/account")}>Accounts and payments</p>
        </div>
        <div className="space-y-4 text-xs text-primary-black  cursor-pointer">
          <h5 className="font-bold text-[16px]">CATEGORIES</h5>
          <p onClick={() => Navigate("/app")}>Writing and Translation</p>
          <p onClick={() => Navigate("/app")}>Business and Marketing</p>
          <p onClick={() => Navigate("/app")}>Nutrition</p>
          <p onClick={() => Navigate("/app")}>Health and Fitness</p>
          <p onClick={() => Navigate("/app")}>Education</p>
          <p onClick={() => Navigate("/app")}>Technology</p>
        </div>
        <div className="space-y-4 text-xs text-primary-black cursor-pointer">
          <h5 className="font-bold text-[16px]">SUPPORT</h5>
          <p onClick={() => Navigate("/")}>Home</p>
          <p onClick={() => Navigate("/account")}>My account</p>
          <p onClick={() => Navigate("/my-assistants")}>Chat Assistants</p>
          <p onClick={() => Navigate("/use_cases")}>Use Cases</p>
        </div>
      </div>
      <div className="px-10 md:px-32 py-4 grid grid-cols-1 md:grid-cols-2 border-t-[1px] border-light-grey space-y-2 md:space-y-1">
        <div className="flex items-center space-x-1 md:space-x-2">
          <p className="text-xs">English (US)</p>
          <p className="text-xs">USD</p>
          <div className="flex items-center space-x-1">
            <Instagram className="w-5 h-5 text-primary-black cursor-pointer" />
            <Facebook className="w-5 h-5 text-primary-black cursor-pointer" />
            <Twitter className="w-5 h-5 text-primary-black cursor-pointer" />
          </div>
        </div>
        <div className="flex items-center space-x-3 md:space-x-4">
          <p className="text-xs">Privacy</p>
          <p className="text-xs">Terms</p>
          <p className="text-xs">Sitemap</p>
          <p className="text-xs font-semibold">
            &copy; {new Date().getFullYear()} StacksinEden inc
          </p>
        </div>
      </div>
    </div>
  );
};

export default WebFooter;
