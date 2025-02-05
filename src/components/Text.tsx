import { PropsWithChildren } from "react";
import styled from "styled-components";

interface StyledTextProps {
  variant?: Variant;
}

const StyledText = styled.p<StyledTextProps>`
  color: ${({ theme, variant }) =>
    theme[!variant || variant === "default" ? "foreground" : ""]};
`;
export const Text: React.FC<
  PropsWithChildren<{ tag?: string } & StyledTextProps>
> = ({ tag, children, ...textProps }) => {
  return (
    <StyledText as={tag ?? "p"} {...textProps}>
      {children}
    </StyledText>
  );
};
