import Categories from "./Categories";
import Container from "./Container";
import Logo from "./Logo";
import { useLocation } from "react-router-dom";
import UserMenu from "./UserMenu";

const Navbar = () => {
  const location = useLocation();

  const isAppPage = location.pathname.includes("/app"); 

  return (
    <div className="fixed w-full bg-white shadow-sm z-10">
      <div className="py-2 md:py-4 px-3 border-b-[1px]">
        <Container>
          <div className="flex justify-between flex-row items-center gap-3 md:gap-0">
            <Logo />
            <UserMenu />
          </div>
        </Container>
      </div>
      {/* Render Categories component only if on the app page */}
      {isAppPage && <Categories />}
    </div>
  );
};

export default Navbar;
