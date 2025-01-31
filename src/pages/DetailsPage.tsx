import { usePhoto } from "hooks/photos";
import { useParams } from "react-router";

export const DetailsPage: React.FC = () => {
  const params = useParams();
  const { data, isLoading } = usePhoto({ id: params.id! });

  if (isLoading) {
    return "loading...";
  }
  return <img src={data?.src?.large} />;
};
