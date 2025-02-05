import { Search } from "./Search";
import { Link, useSearchParams } from "react-router";
import { RiLayoutMasonryLine } from "react-icons/ri";
import styled from "styled-components";
import { Container } from "./Container";
import { ToggleTheme } from "./ToggleTheme";

const StyledHeader = styled.header`
  background-color: ${(props) => props.theme.background};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100vw;
  box-shadow: 0 0 1px
    ${({ theme: { darkMode } }) => (darkMode ? "#b4b4b4" : "#2f2f2f")};

  ${Container} {
    display: flex;
    align-items: center;
    justify-content: space-between;

    & > * {
      flex: 1;
      &:nth-child(2) {
        text-align: center;
      }

      &:last-child {
        text-align: right;
      }
    }
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
        <div>
          <HomeLink
            aria-label="Go to home page"
            to={"/?" + searchParams.toString()}
          >
            <RiLayoutMasonryLine size="40px" />
          </HomeLink>
        </div>
        <Search />
        <ToggleTheme />
      </Container>
    </StyledHeader>
  );
};
