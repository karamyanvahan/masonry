import { PexelsPhoto } from "api/types";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const StyledMasonryGridItem = styled.div<{ isLoading: boolean }>`
  position: relative;
  margin: 16px 0;
  border-radius: 14px;
  overflow: hidden;

  img {
    width: 100%;
  }

  .placeholder {
    pointer-events: none;
    position: absolute;
    width: 100%;
    transition: opacity 0.2s;
    opacity: ${(props) => (props.isLoading ? 1 : 0)};
  }
`;

export const MasonryItem: React.FC<{
  photo: PexelsPhoto;
}> = ({ photo }) => {
  const placeholderEl = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [placeholderHeight, setPlaceholderHeight] = useState(0);

  useEffect(() => {
    if (placeholderEl.current?.clientWidth) {
      setPlaceholderHeight(
        (placeholderEl.current?.clientWidth / photo.width) * photo.height
      );
    }
  }, [photo.height, photo.width]);

  return (
    <StyledMasonryGridItem isLoading={isLoading}>
      <div
        className="placeholder"
        ref={placeholderEl}
        style={{
          height: placeholderHeight + "px",
          backgroundColor: photo.avg_color,
        }}
      ></div>
      <img
        height={isLoading ? placeholderHeight : undefined}
        alt={photo.alt}
        src={photo.src?.large}
        onLoad={() => {
          setIsLoading(false);
        }}
      />
    </StyledMasonryGridItem>
  );
};
