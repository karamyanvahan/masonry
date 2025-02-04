import { Button } from "components/Button";
import { Text } from "components/Text";
import { Link } from "react-router";
import styled from "styled-components";

const StyledContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;

  h1 {
    font-size: 4em;
  }
  a {
    margin-top: 10px;
  }
`;

export const NotFoundPage: React.FC = () => {
  return (
    <StyledContainer>
      <Text tag="h1">404</Text>
      <Text>Not Found</Text>
      <Link to="/">
        <Button aria-label="Go to home page">Go to home page</Button>
      </Link>
    </StyledContainer>
  );
};
