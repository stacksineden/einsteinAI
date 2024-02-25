
const NavItem = ({ onClick, label }: NavItemsProps) => {

  return (
    <div
      className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export default NavItem;

type NavItemsProps = {
  onClick?: () => void;
  label?: string;
};
