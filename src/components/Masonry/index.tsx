import { PexelsPhotoResponse } from "api/types";
import { usePhotos } from "hooks/photos";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { findMinIndex } from "utils";
import { MasonryItem } from "./MasonryItem";
import React from "react";
import { Loader } from "components/Loader";

const StyledMasonryContainer = styled.div<{
  height?: string;
  selfScroll?: boolean;
}>`
  overflow-y: ${(props) => (props.selfScroll ? "scroll" : "auto")};
  height: ${(props) => props.height};

  .photos-container {
    display: flex;
    gap: 16px;
    font-size: 0;

    & > div {
      flex: 1;
    }
  }

  .loader-container {
    display: flex;
    justify-content: center;
  }
`;

export const Masonry: React.FC<{
  className?: string;
  height?: string;
  selfScroll?: boolean;
  searchQuery?: string;
}> = ({ className, height, selfScroll, searchQuery }) => {
  const colCount = 8;
  const perPage = 40;
  const intersectionEl = useRef<HTMLDivElement>(null);
  const containerEl = useRef<HTMLDivElement>(null);
  const [data, setData] = useState(
    new Array<PexelsPhotoResponse[]>(colCount).fill([])
  );
  const [page, setPage] = useState(1);
  const { data: response, isLoading } = usePhotos({
    page,
    perPage,
    search: searchQuery,
  });

  const normalizeData = useCallback((data: PexelsPhotoResponse[]) => {
    const result: PexelsPhotoResponse[][] = [];
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
  }, []);

  const normalizedResponse = useMemo(() => {
    if (!response) {
      return null;
    }
    return normalizeData(response.photos);
  }, [normalizeData, response]);

  useEffect(() => {
    if (!normalizedResponse) {
      return;
    }

    setData((prev) => {
      return prev.map((col, i) => col.concat(normalizedResponse[i]));
    });
  }, [normalizedResponse]);

  useEffect(() => {
    setData(new Array<PexelsPhotoResponse[]>(colCount).fill([]));
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (
          isLoading ||
          (response && page * perPage > response?.total_results)
        ) {
          return;
        }

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPage((prev) => prev + 1);
          }
        });
      },
      {
        root: selfScroll ? containerEl.current : undefined,
        rootMargin: "500px",
      }
    );

    intersectionObserver.observe(intersectionEl.current!);

    return () => {
      intersectionObserver.disconnect();
    };
  }, [isLoading, page, response, selfScroll]);

  return (
    <StyledMasonryContainer
      selfScroll={selfScroll}
      className={className}
      height={height}
      ref={containerEl}
    >
      <div className="photos-container">
        {data.map((photos, i) => (
          <div key={photos[0]?.id ?? i}>
            {photos.map((photo, i) => (
              <MasonryItem photo={photo} key={i} />
            ))}
          </div>
        ))}
      </div>
      <div ref={intersectionEl}></div>
      {isLoading && (
        <div className="loader-container">
          <Loader />
        </div>
      )}
    </StyledMasonryContainer>
  );
};
