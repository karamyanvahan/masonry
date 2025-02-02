import { PexelsPhotoResponse } from "api/types";
import { Image } from "components/Image";
import React from "react";
import { Link } from "react-router";
import styled from "styled-components";

const StyledMasonryGridItem = styled.div`
  margin: 16px 0;
  border-radius: 14px;
  overflow: hidden;
`;

export const MasonryItem: React.FC<{
  photo: PexelsPhotoResponse;
}> = ({ photo }) => {
  return (
    <Link to={"/" + photo.id + window.location.search}>
      <StyledMasonryGridItem>
        <Image
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
