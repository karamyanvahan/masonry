import { Search } from "./Search";
import { Link, useNavigate, useSearchParams } from "react-router";
import { AiOutlineHome } from "react-icons/ai";
import styled from "styled-components";

const StyledHeader = styled.header`
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100vw;
  padding: 2px 30px 2px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 0 1px #2f2f2f;
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
