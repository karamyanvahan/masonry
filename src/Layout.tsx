import { Container } from "components/Container";
import { Outlet } from "react-router";

export const Layout: React.FC = () => {
  return (
    <Container>
      <Outlet />
    </Container>
  );
};
