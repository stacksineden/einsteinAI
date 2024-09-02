import SideBar from "@/components/shared/SideBar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="h-full">
      <div className="bg-zinc-900 h-full">
        <main>
          <div>
            <div className="bg-zinc-900 relative overflow-hidden">
              <div className="flex h-full">
                <SideBar />
                <main className="h-[100dvh] flex-1 overflow-x-hidden">
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




