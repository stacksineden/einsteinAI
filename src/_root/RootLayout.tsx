import SideBar from "@/components/shared/SideBar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="h-screen">
            {/* <Navbar/> */}
      <div className="bg-zinc-900 h-screen">
        <main>
          <div>
            <div className="bg-zinc-900 relative overflow-hidden">
              <div className="flex h-screen">
                <SideBar />
                <main className="h-screen flex-1 overflow-x-hidden">
                  <Outlet />
                </main>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RootLayout;




