import { PexelsPhotoResponse } from "api/types";
import { usePhotos } from "hooks/photos";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { findMinIndex } from "utils";
import { MasonryItem } from "./MasonryItem";
import React from "react";
import { Loader } from "components/Loader";

const StyledMasonryContainer = styled.div<{
  height?: string;
  selfScroll?: boolean;
}>`
  overflow-y: ${(props) => (props.selfScroll ? "scroll" : "visible")};
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
    height: 100px;
  }
`;

export const Masonry: React.FC<{
  className?: string;
  height?: string;
  selfScroll?: boolean;
  searchQuery?: string;
}> = ({ className, height, selfScroll, searchQuery }) => {
  const perPage = 40;
  const colWidth = 180;
  const intersectionEl = useRef<HTMLDivElement>(null);
  const containerEl = useRef<HTMLDivElement>(null);
  const rowData = useRef<PexelsPhotoResponse[]>([]);
  const heights = useRef<number[]>([]);
  const [colCount, setColCount] = useState<number>(0);
  const [data, setData] = useState<PexelsPhotoResponse[][]>([]);
  const [page, setPage] = useState(0);
  const { data: response, isLoading } = usePhotos({
    page,
    perPage,
    search: searchQuery,
    skip: page === 0,
  });

  const normalizeData = useCallback(
    (data: PexelsPhotoResponse[]) => {
      if (colCount === 0) {
        return [];
      }
      const result: PexelsPhotoResponse[][] = [];

      for (let i = 0; i < colCount; i++) {
        result.push([]);
      }

      data.forEach((photo) => {
        const mostEmptyIndex = findMinIndex(heights.current);
        const mostEmpty = result[mostEmptyIndex];
        heights.current[mostEmptyIndex] += photo.height / photo.width;
        mostEmpty.push(photo);
      });

      return result;
    },
    [colCount]
  );

  useEffect(() => {
    if (!response) {
      return;
    }
    rowData.current.push(...response.photos);
    const normalizedResponse = normalizeData(response.photos);

    setData((prev) => {
      if (prev.length === 0) {
        return normalizedResponse;
      }
      return prev.map((col, i) => col.concat(normalizedResponse[i]));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  useEffect(() => {
    heights.current = heights.current.map(() => 0);
    setData([]);
    rowData.current = [];
    setPage(0);
  }, [searchQuery]);

  useEffect(() => {
    if (!containerEl.current) {
      return;
    }
    setColCount(
      Math.max(Math.floor(containerEl.current.clientWidth / colWidth), 3)
    );
    let toId: number | null = null;
    const resizeObserver = new ResizeObserver((entries) => {
      if (toId) {
        clearTimeout(toId);
      }
      toId = setTimeout(() => {
        setColCount(
          Math.max(
            Math.floor(entries[0].contentBoxSize[0].inlineSize / colWidth),
            3
          )
        );
      }, 200);
    });

    resizeObserver.observe(containerEl.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    heights.current = new Array(colCount).fill(0);
    setData(normalizeData(rowData.current));
  }, [colCount]);

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (
          isLoading ||
          (response && page * perPage > response?.total_results)
        ) {
          return;
        }

        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
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
              <MasonryItem photo={photo} key={photo.id + "" + i} />
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
