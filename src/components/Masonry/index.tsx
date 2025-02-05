import { PexelsPhotoResponse } from "api/types";
import { usePhotos } from "hooks/photos";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { findMinIndex, getResizedImageUrl } from "utils";
import React from "react";
import { Loader } from "components/Loader";
import { Button } from "components/Button";
import { Text } from "components/Text";
import { GridData, VirtualizedGrid } from "./VirtualizedGrid";

const StyledMasonryContainer = styled.div<{
  height?: string;
}>`
  overflow-y: scroll;
  height: ${(props) => props.height ?? "100%"};
  padding-inline: 16px;

  .bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    padding-top: 10px;
    height: 100px;
  }

  .row {
    position: relative;
  }
`;

export const Masonry: React.FC<{
  height?: string;
  searchQuery?: string;
}> = ({ height, searchQuery }) => {
  const perPage = 80;
  const colWidth = 240;
  const intersectionEl = useRef<HTMLDivElement>(null);
  const containerEl = useRef<HTMLDivElement>(null);
  const rawData = useRef<PexelsPhotoResponse[]>([]);
  const heights = useRef<number[] | null>(null);
  const [data, setData] = useState<GridData>([]);
  const [page, setPage] = useState(0);

  const {
    data: response,
    isLoading,
    error,
    fetch,
  } = usePhotos({
    page,
    perPage,
    search: searchQuery,
    skip: page === 0,
  });

  const reset = () => {
    heights.current = null;
    setData([]);
    rawData.current = [];
    setPage(0);
  };

  //normalize data for displaying as masonry grid
  const normalizeData = useCallback((data: PexelsPhotoResponse[]) => {
    const colCount = Math.max(
      Math.floor((containerEl.current?.clientWidth ?? 0) / colWidth),
      3
    );

    const result: GridData = new Array(colCount).fill(1).map(() => []);

    if (heights.current === null) {
      heights.current = new Array(colCount).fill(0);
    }

    const gap = 16;
    const itemWidth =
      ((containerEl.current?.clientWidth ?? 0) - (colCount + 1) * gap) /
      colCount;

    data.forEach((photo, index) => {
      const mostEmptyIndex = findMinIndex(heights.current!);
      const mostEmpty = result[mostEmptyIndex];
      const itemHeight = (photo.height / photo.width) * itemWidth;
      mostEmpty.push({
        ...photo,
        y: heights.current![mostEmptyIndex],
        key: photo.id + "" + index,
        src: getResizedImageUrl(photo.src.original, { width: colWidth }),
        smallSrc: getResizedImageUrl(photo.src.original, { width: 133 }),
      });
      heights.current![mostEmptyIndex] += itemHeight + gap;
    });

    return result;
  }, []);

  //when getting new images normalize response and concat it with previous data
  useEffect(() => {
    if (!response) {
      return;
    }
    rawData.current.push(...response.photos);
    const normalizedResponse = normalizeData(response.photos);

    setData((prev) => {
      if (prev.length === 0) {
        return normalizedResponse;
      }
      return prev.map((col, i) => col.concat(normalizedResponse[i]));
    });
  }, [normalizeData, response]);

  //on search reset grid
  useEffect(() => {
    reset();
  }, [searchQuery]);

  //adjust grid when resizing
  useEffect(() => {
    if (!containerEl.current) {
      return;
    }

    let toId: number | null = null;
    const resizeObserver = new ResizeObserver(() => {
      if (toId) {
        clearTimeout(toId);
      }
      heights.current = null;
      toId = setTimeout(() => {
        heights.current = null;
        setData(normalizeData(rawData.current));
      }, 200);
    });

    resizeObserver.observe(containerEl.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [normalizeData]);

  //implement infinite scroll
  useEffect(() => {
    let timeoutId = 0;
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (
          isLoading ||
          error ||
          (response && page * perPage > response?.total_results)
        ) {
          return;
        }

        if (entries[0].isIntersecting) {
          timeoutId = setTimeout(() => {
            setPage((prev) => prev + 1);
          });
        } else {
          clearTimeout(timeoutId);
        }
      },
      {
        root: containerEl.current,
        rootMargin: "500px",
      }
    );

    intersectionObserver.observe(intersectionEl.current!);

    return () => {
      intersectionObserver.disconnect();
    };
  }, [error, isLoading, page, response]);

  return (
    <StyledMasonryContainer height={height} ref={containerEl}>
      <VirtualizedGrid
        height={Math.max(...(heights.current ?? [0]))}
        data={data}
        container={containerEl.current}
      />
      <div ref={intersectionEl}></div>
      <div className="bottom">
        {isLoading && <Loader />}
        {error && (
          <>
            <Text variant="error">Failed to fetch</Text>
            <Button
              aria-label="Try again"
              variant="error"
              type="button"
              onClick={() => {
                fetch();
              }}
            >
              Try again
            </Button>
          </>
        )}
      </div>
    </StyledMasonryContainer>
  );
};
