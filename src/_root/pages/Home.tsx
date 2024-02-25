import AssistantCard from "@/components/shared/AssistantCard";
import Container from "@/components/shared/Container";
import EmptyComponent from "@/components/shared/EmptyComponent";
import { useAssistantCategoryContext } from "@/context/AssistantCategoryContext";
// import { useUserContext } from "@/context/AuthContext";
import { dataSet } from "@/modelDataset";

const Home = () => {
  const { assistantCategory } = useAssistantCategoryContext();
  // const {isEmailVerified} = useUserContext();

  // console.log(isEmailVerified,'arike')

  // Check if assistantCategory is an empty string
  const filteredAssistants = assistantCategory
    ? dataSet?.filter((item) => item?.category === assistantCategory)
    : dataSet;

  if (!filteredAssistants || filteredAssistants.length === 0) {
    return <EmptyComponent />;
  }

  return (
    <Container>
      <div className="pt-20 md:pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-4 p-6 md:p-0">
        {filteredAssistants?.map((item, _i) => (
          <AssistantCard key={_i} data={item} />
        ))}
      </div>
    </Container>
  );
};

export default Home;
