import { PexelsPhoto } from "api/types";
import React from "react";
import styled from "styled-components";

const StyledMasonryGridItem = styled.div`
  position: relative;
  margin: 5px 0;

  img {
    width: 100%;
  }

  .overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0;
    transition: 0.1s;
    background-color: #000000bb;

    &:hover {
      opacity: 1;
    }
  }

  .placeholder {
    position: absolute;
    width: 100%;
  }
`;

export const MasonryItem: React.FC<{
  photo: PexelsPhoto;
}> = ({ photo }) => {
  return (
    <StyledMasonryGridItem>
      <div className="overlay"></div>
      <img alt={photo.alt} src={photo.src?.large} />
    </StyledMasonryGridItem>
  );
};
