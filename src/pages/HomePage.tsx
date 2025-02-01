import { Masonry } from "components/Masonry";
import { Search } from "components/Search";
import { useState } from "react";

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Search onSearch={setSearchQuery} />
      <Masonry searchQuery={searchQuery} />
    </>
  );
};
