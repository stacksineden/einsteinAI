import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Menu, UserCircle } from "lucide-react";
import { useState } from "react";

const nav_Links = [
  // {
  //   url: "/",
  //   key: "home",
  //   label: "Home",
  // },
  {
    url: "/use_cases",
    key: "use_cases",
    label: "Use Cases",
  },
  {
    url: "/pricing",
    key: "pricing",
    label: "Pricing",
  },
  {
    url: "https://medium.com/@stacksineden",
    key: "blog",
    label: "Blog",
  },
  {
    url: "/help-center",
    key: "faqs",
    label: "FAQs",
  },
  {
    url: "/enterprise",
    key: "enterprise",
    label: "Enterprise",
  },
];

const WebNavBar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const closenModal = () => {
    setOpen(false);
  };
  return (
    <>
      {open && (
        <div
          className={`w-[100vw] h-screen fixed inset-0 z-50 backdrop-blur-sm`}
        >
          <div
            className={`fixed inset-x-4 top-8 z-50 origin-top rounded-3xl p-8 ring-1 ring-zinc-900/5 bg-black opacity-100 scale-100`}
          >
            <div className="flex flex-row-reverse items-center justify-between">
              <button
                aria-label="Close menu"
                className="-m-1 p-1"
                type="button"
                onClick={() => closenModal()}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className={`h-6 w-6 text-zinc-400`}
                >
                  <path
                    d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </button>
              <h2 className={`text-sm font-medium text-zinc-400`}>
                Navigation
              </h2>
            </div>
            <nav className="mt-6">
              <ul
                className={`my-2 divide-y text-base divide-zinc-100 text-zinc-300`}
                onClick={() => closenModal()}
              >
                {/* <Link to="/">
                  {" "}
                  <li className="block py-2">Home</li>
                </Link> */}
                <Link to="/use_cases">
                  {" "}
                  <li className="block py-2">Use Cases</li>
                </Link>
                <Link to="/pricing">
                  {" "}
                  <li className="block py-2">Pricing</li>
                </Link>
                <Link to="https://medium.com/@stacksineden" target="_blank">
                  <li className="block py-2">Blog</li>
                </Link>
                <Link to="/help-center">
                  {" "}
                  <li className="block py-2">FAQs</li>
                </Link>
                <Link to="/enterprise">
                  {" "}
                  <li className="block py-2">Enterprise</li>
                </Link>
              </ul>
            </nav>
          </div>
        </div>
      )}
      <nav className="mx-auto max-w-[1440px] flex items-center justify-between z-30 py-5 px-6 lg:px-20 3xl:px-0 sticky top-0 w-full bg-black">
        <Link to="/" className="w-[150px] md:w-[170px]">
          <img
            src="/assets/images/text-brand.png"
            alt="brand"
            className="w-full object-contain"
            loading="lazy"
          />
        </Link>
        <ul className="hidden h-full gap-12 lg:flex">
          {nav_Links?.map((link) => (
            <Link
              to={link?.url}
              key={link?.key}
              className="text-sm text-zinc-300 flex items-center justify-center cursor-pointer pb-1.5 transition-all hover:font-bold hover:text-primary-blue font-medium"
            >
              {link?.label}
            </Link>
          ))}
        </ul>
        <div className="lg:flex items-center justify-center hidden gap-3">
          <Button
            className="bg-zinc-100 text-zinc-900 flex text-base border border-light-grey hover:shadow-md gap-2"
            onClick={() => navigate("/sign-in")}
          >
            {/* <UserCircle className="text-light-grey h-4 w-4" /> */}
            Sign in
          </Button>
          <Button
            className="shad-button_zinc" 
            onClick={() => navigate("/sign-in")}
          >
            <UserCircle className="text-light-grey h-4 w-4" /> 
            Get Started
          </Button>
        </div>

        <Menu
          className="lg:hidden flex items-center justify-center text-zinc-100 h-7 w-7 cursor-pointer"
          onClick={() => setOpen(true)}
        />
      </nav>
    </>
  );
};

export default WebNavBar;
