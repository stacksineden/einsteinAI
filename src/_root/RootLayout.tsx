import Navbar from "@/components/shared/Navbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="pb-20 pt-28">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
