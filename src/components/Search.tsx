import { useRef } from "react";
import styled from "styled-components";

const StyledSearch = styled.div``;

export const Search: React.FC<{ onSearch: (q: string) => void }> = ({
  onSearch,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <StyledSearch>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(inputRef.current?.value || "");
        }}
      >
        <input type="text" ref={inputRef} />
        <button type="submit">Search</button>
      </form>
    </StyledSearch>
  );
};
