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
`;

export const MasonryItem: React.FC<{
  photo: DataItem;
}> = ({ photo }) => {
  return (
    <Link to={"/" + photo.id + window.location.search}>
      <StyledMasonryGridItem style={{ top: photo.y }}>
        <Image
          fullWidth
          loading="lazy"
          width={photo.width}
          height={photo.height}
          src={photo.src?.medium}
          alt={photo.alt}
          placeholderColor={photo.avg_color}
        />
      </StyledMasonryGridItem>
    </Link>
  );
};
