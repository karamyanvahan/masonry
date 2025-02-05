import { Header } from "components/Header";
import { Outlet } from "react-router";
import styled from "styled-components";

const StyledPageContent = styled.div`
  padding-top: 90px;
`;

const StyledLayout = styled.div`
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.foreground};
  a {
    color: ${({ theme }) => theme.foreground};
  }
`;

export const Layout: React.FC = () => {
  return (
    <StyledLayout>
      <Header />
      <StyledPageContent>
        <Outlet />
      </StyledPageContent>
    </StyledLayout>
  );
};
