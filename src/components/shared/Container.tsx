const Container = ({ children }: ContainerProps) => {
  return <div className="max-w-[2520px] mx-auto">{children}</div>;
};

export default Container;

type ContainerProps = {
  children: React.ReactNode;
};
