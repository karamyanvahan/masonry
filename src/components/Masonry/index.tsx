import { PexelsPhoto } from "api/types";
import { usePhotos } from "hooks/usePhotos";
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { findMinIndex } from "utils";
import { MasonryItem } from "./MasonryItem";

const StyledMasonryContainer = styled.div`
  .photos-container {
    display: flex;
    gap: 5px;
    font-size: 0;

    & > div {
      flex: 1;
    }
  }
`;

export const Masonry: React.FC = () => {
  const colCount = 8;
  const intersectionEl = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(1);
  const { data, isLoading } = usePhotos({
    page,
    perPage: 40,
  });

  const normalizedData = useMemo(() => {
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

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (isLoading) {
          return;
        }

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPage((prev) => prev + 1);
          }
        });
      },
      {
        rootMargin: "500px",
      }
    );

    intersectionObserver.observe(intersectionEl.current!);

    return () => {
      intersectionObserver.disconnect();
    };
  }, [isLoading]);

  return (
    <StyledMasonryContainer>
      <div className="photos-container">
        {normalizedData?.map((photos) => (
          <div key={photos[0]?.id}>
            {photos.map((photo, i) => (
              <MasonryItem photo={photo} key={i} />
            ))}
          </div>
        ))}
      </div>
      <div ref={intersectionEl}></div>
    </StyledMasonryContainer>
  );
};
