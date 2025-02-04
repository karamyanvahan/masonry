import { Masonry } from "components/Masonry";
import { useSearchParams } from "react-router";

export const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();

  return (
    <Masonry
      height="calc(100vh - 90px)"
      searchQuery={searchParams.get("q") || ""}
    />
  );
};
