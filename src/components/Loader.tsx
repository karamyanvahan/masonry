import styled from "styled-components";

export const Loader = styled.div`
  height: 40px;
  aspect-ratio: 0.866;
  display: grid;
  background: conic-gradient(
    from -121deg at right,
    #0000,
    #bf1e62 1deg 60deg,
    #0000 61deg
  );
  animation: l12 2s infinite linear;
  transform-origin: 33% 50%;
  &:before,
  &:after {
    content: "";
    grid-area: 1/1;
    background: conic-gradient(
      from -121deg at right,
      #0000,
      #ffa588 1deg 60deg,
      #0000 61deg
    );
    transform-origin: inherit;
    animation: inherit;
  }
  &:after {
    background: conic-gradient(
      from -121deg at right,
      #0000,
      #027b7f 1deg 60deg,
      #0000 61deg
    );
    animation-duration: 3s;
  }
  @keyframes l12 {
    100% {
      transform: rotate(1turn);
    }
  }
`;
