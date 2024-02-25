const Container = ({ children }: ContainerProps) => {
  return <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 xs:px-4">{children}</div>;
};

export default Container;

type ContainerProps = {
  children: React.ReactNode;
};
