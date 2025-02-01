import { PexelsPhotoResponse } from "api/types";
import { Image } from "components/Image";
import React, { useEffect, useRef, useState } from "react";
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
  const imageEl = useRef<HTMLImageElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const setPlaceholderHeight = () => {
      if (imageEl.current?.clientWidth) {
        setHeight((imageEl.current.clientWidth / photo.width) * photo.height);
      }
    };
    setPlaceholderHeight();
    window.addEventListener("resize", setPlaceholderHeight);

    return () => {
      window.removeEventListener("resize", setPlaceholderHeight);
    };
  }, [photo.height, photo.width]);

  return (
    <Link to={"/" + photo.id}>
      <StyledMasonryGridItem>
        <Image
          ref={imageEl}
          height={height}
          src={photo.src?.medium}
          alt={photo.alt}
          placeholderColor={photo.avg_color}
        />
      </StyledMasonryGridItem>
    </Link>
  );
};
