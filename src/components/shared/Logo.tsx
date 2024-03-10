import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/app" className="w-[150px] md:w-[170px]">
      <img
        src="/assets/images/text-brand.png"
        alt="brand"
        className="w-full object-contain"
      />
    </Link>
  );
};

export default Logo;
