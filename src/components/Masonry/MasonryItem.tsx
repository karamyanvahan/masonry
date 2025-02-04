import { Image } from "components/Image";
import React from "react";
import { Link } from "react-router";
import styled from "styled-components";
import { DataItem } from "./VirtualizedGrid";

const StyledMasonryGridItem = styled.div`
  position: absolute;
  border-radius: 14px;
  overflow: hidden;

  width: 100%;
  img {
    width: 100%;
  }

  &:focus-within {
    display: block;
    border: 3px solid #0b79a6;
    border-radius: 14px;
  }
`;

export const MasonryItem: React.FC<{
  photo: DataItem;
}> = ({ photo }) => {
  return (
    <StyledMasonryGridItem style={{ top: photo.y }}>
      <Link
        to={"/" + photo.id + window.location.search}
        aria-label={photo.alt || "untitled photo"}
      >
        <Image
          fullWidth
          width={photo.width}
          height={photo.height}
          src={photo.src}
          smallSrc={photo.smallSrc}
          alt={photo.alt}
          placeholderColor={photo.avg_color}
        />
      </Link>
    </StyledMasonryGridItem>
  );
};
