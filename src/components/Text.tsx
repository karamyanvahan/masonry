import { PropsWithChildren } from "react";
import styled from "styled-components";

const StyledText = styled.p<{ variant: Variant }>`
  color: ${({ theme, variant }) => theme[variant]};
`;
export const Text: React.FC<
  PropsWithChildren<{ tag?: string; variant: Variant }>
> = ({ tag, variant, children }) => {
  return (
    <StyledText as={tag} variant={variant}>
      {children}
    </StyledText>
  );
};
