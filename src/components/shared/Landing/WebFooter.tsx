import { Facebook, Instagram, Twitter } from "lucide-react";

const WebFooter = () => {
  return (
    <div className="bg-light-grey text-primary-black">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-y-10 px-20 md:px-32 py-14">
        <div className="space-y-4 text-xs text-primary-black cursor-pointer">
          <h5 className="font-bold text-[16px]">ABOUT</h5>
          <p>How strythive works</p>
          <p>Blog</p>
          <p>Gridhouse</p>
          <p>investors</p>
          <p>FAQs</p>
        </div>
        <div className="space-y-4 text-xs text-primary-black cursor-pointer">
          <h5 className="font-bold text-[16px]">USEFUL LINKS</h5>
          <p>Help center</p>
          <p>Safety information</p>
          <p>Renting</p>
          <p>Accounts and payments</p>
        </div>
        <div className="space-y-4 text-xs text-primary-black  cursor-pointer">
          <h5 className="font-bold text-[16px]">CATEGORIES</h5>
          <p>Arts</p>
          <p>Beauty and body care</p>
          <p>Technology</p>
          <p>Media and production</p>
          <p>Business and consulting</p>
          <p>Fashion</p>
          <p>Laundry and home care</p>
          <p>Repairs and installation</p>
        </div>
        <div className="space-y-4 text-xs text-primary-black cursor-pointer">
          <h5 className="font-bold text-[16px]">SUPPORT</h5>
          <p>Home</p>
          <p>My account</p>
          <p>User experience</p>
          <p>Wishlist</p>
        </div>
      </div>
      <div className="px-10 md:px-32 py-4 grid grid-cols-1 md:grid-cols-2 border-t-[1px] border-light-grey space-y-2 md:space-y-1">
        <div className="flex items-center space-x-1 md:space-x-2">
          <p className="text-xs">English (US)</p>
          <p className="text-xs">Naira</p>
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
