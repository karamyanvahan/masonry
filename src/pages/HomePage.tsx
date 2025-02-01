import { Masonry } from "components/Masonry";
import { Search } from "components/Search";
import { useSearchParams } from "react-router";

export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      <Search onSearch={(q) => setSearchParams({ q: q })} />
      <Masonry searchQuery={searchParams.get("q") || ""} />
    </>
  );
};
