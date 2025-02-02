import { Masonry } from "components/Masonry";
import { Search } from "components/Search";
import { useSearchParams } from "react-router";
import styled from "styled-components";

const StyledPage = styled.div`
  .grid-container {
    height: calc(100vh - 67px);
  }
`;

export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <StyledPage>
      <Search onSearch={(q) => setSearchParams({ q: q })} />
      <div className="grid-container">
        <Masonry searchQuery={searchParams.get("q") || ""} />
      </div>
    </StyledPage>
  );
};
