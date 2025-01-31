import { PexelsPhoto } from "api/types";
import { usePhotos } from "hooks/usePhotos";
import { useMemo } from "react";
import styled from "styled-components";
import { findMinIndex } from "utils";
import { MasonryItem } from "./MasonryItem";

const StyledMasonryContainer = styled.div`
  display: flex;
  gap: 5px;
  font-size: 0;

  & > div {
    flex: 1;
  }
`;

export const Masonry: React.FC = () => {
  const colCount = 8;
  const { data } = usePhotos({
    page: 1,
    perPage: 40,
  });

  const normalizedPhotos = useMemo(() => {
    if (!data.length) {
      return null;
    }

    const result: PexelsPhoto[][] = [];
    const heights: number[] = [];

    for (let i = 0; i < colCount; i++) {
      result.push([]);
      heights.push(0);
    }

    data.forEach((photo) => {
      const mostEmptyIndex = findMinIndex(heights);
      const mostEmpty = result[mostEmptyIndex];
      heights[mostEmptyIndex] += photo.height / photo.width;
      mostEmpty.push(photo);
    });

    return result;
  }, [data]);

  return (
    <StyledMasonryContainer>
      {normalizedPhotos?.map((photos) => (
        <div key={photos[0]?.id}>
          {photos.map((photo, i) => (
            <MasonryItem photo={photo} key={i} />
          ))}
        </div>
      ))}
    </StyledMasonryContainer>
  );
};
