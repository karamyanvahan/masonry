import { Search } from "./Search";
import { Link, useSearchParams } from "react-router";
import { RiLayoutMasonryLine } from "react-icons/ri";
import styled from "styled-components";
import { Container } from "./Container";

const StyledHeader = styled.header`
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100vw;
  box-shadow: 0 0 1px #2f2f2f;
  a {
    color: ${({ theme }) => theme.default};
  }

  ${Container} {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const HomeLink = styled(Link)`
  opacity: 0.8;
`;

export const Header: React.FC = () => {
  const [searchParams] = useSearchParams();

  return (
    <StyledHeader>
      <Container>
        <HomeLink
          aria-label="Go to home page"
          to={"/?" + searchParams.toString()}
        >
          <RiLayoutMasonryLine size="40px" />
        </HomeLink>
        <Search />
      </Container>
    </StyledHeader>
  );
};
