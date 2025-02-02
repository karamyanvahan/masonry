import styled from "styled-components";

export const Button = styled.button<{ variant?: Variant }>`
  border: 2px solid ${({ theme, variant }) => theme[variant ?? "default"]};
  color: ${({ theme, variant }) => theme[variant ?? "default"]};
  padding: 1em;
  transition: 0.1s;
  border-radius: 14px;

  &:hover {
    background-color: ${({ theme, variant }) => theme[variant ?? "default"]};
    color: #fff;
  }
`;
