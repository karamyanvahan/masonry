import { useRef } from "react";
import styled from "styled-components";

const StyledSearch = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0;
  .search {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: center;
  }

  .search__input {
    font-family: inherit;
    font-size: inherit;
    background-color: #f4f2f2;
    border: none;
    color: #646464;
    padding: 0.7rem 1rem;
    border-radius: 30px;
    width: 200px;
  }

  .search__input:focus {
    outline: none;
    background-color: #f0eeee;
  }

  .search__input::-webkit-input-placeholder {
    font-weight: 100;
    color: #676666;
  }
`;

export const Search: React.FC<{ onSearch: (q: string) => void }> = ({
  onSearch,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(inputRef.current?.value || "");
        inputRef.current?.blur();
      }}
    >
      <StyledSearch>
        <div className="search">
          <input
            type="search"
            inputMode="search"
            className="search__input"
            placeholder="Search"
            ref={inputRef}
          />
        </div>
      </StyledSearch>
    </form>
  );
};
