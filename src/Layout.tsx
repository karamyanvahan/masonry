import { Header } from "components/Header";
import { Outlet } from "react-router";
import styled from "styled-components";

const StyledPageContent = styled.div`
  margin-top: 90px;
`;

export const Layout: React.FC = () => {
  return (
    <>
      <Header />
      <StyledPageContent>
        <Outlet />
      </StyledPageContent>
    </>
  );
};
