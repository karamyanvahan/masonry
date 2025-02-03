import { Search } from "./Search";
import { Link, useNavigate, useSearchParams } from "react-router";
import { AiOutlineHome } from "react-icons/ai";
import styled from "styled-components";

const StyledHeader = styled.header`
  background-color: White;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100vw;
  padding: 10px;
  padding-right: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  a {
    color: ${({ theme }) => theme.default};
  }
`;

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const onSearch = (q: string) => {
    navigate("/?q=" + q, {
      preventScrollReset: true,
    });
  };

  return (
    <StyledHeader>
      <Link to={"/?" + searchParams.toString()}>
        <AiOutlineHome size="40px" />
      </Link>
      <Search onSearch={onSearch} />
    </StyledHeader>
  );
};
