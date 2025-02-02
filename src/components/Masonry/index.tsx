import { PexelsPhotoResponse } from "api/types";
import { usePhotos } from "hooks/photos";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { findMinIndex } from "utils";
import { MasonryItem } from "./MasonryItem";
import React from "react";
import { Loader } from "components/Loader";
import { Button } from "components/Button";
import { Text } from "components/Text";

type DataItem = PexelsPhotoResponse & { y: number; key: string };

const StyledMasonryContainer = styled.div<{
  height?: string;
  imageContainerHeight: number;
}>`
  overflow-y: scroll;
  height: ${(props) => props.height ?? "100%"};

  .photos-container {
    display: flex;
    gap: 16px;
    font-size: 0;
    height: ${(props) => props.imageContainerHeight + "px"};
    & > div {
      flex: 1;
    }
  }

  .bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    height: 100px;
  }

  .row {
    position: relative;
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
  const [data, setData] = useState<DataItem[][]>([]);
  const [virtualizedData, setVirtualizedData] = useState<DataItem[][]>([]);
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

  const normalizeData = useCallback(
    (data: PexelsPhotoResponse[]) => {
      if (colCount === 0) {
        return [];
      }
      const gap = 16;
      const itemWidth =
        ((containerEl.current?.clientWidth ?? 0) - (colCount - 1) * gap) /
        colCount;
      const result: DataItem[][] = [];

      for (let i = 0; i < colCount; i++) {
        result.push([]);
      }

      data.forEach((photo, index) => {
        const mostEmptyIndex = findMinIndex(heights.current);
        const mostEmpty = result[mostEmptyIndex];
        const itemHeight = (photo.height / photo.width) * itemWidth;

        mostEmpty.push({
          ...photo,
          y: heights.current[mostEmptyIndex],
          key: photo.id + "" + index,
        });
        heights.current[mostEmptyIndex] += itemHeight + gap;
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
          }, 100);
        } else {
          clearTimeout(timeoutId);
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
  }, [error, isLoading, page, response, selfScroll]);

  useEffect(() => {
    const container = containerEl.current;
    if (!container) {
      return;
    }

    const updateVirtualizedData = () => {
      const result = data.map((row) =>
        row.filter(
          (item) =>
            item.y > container.scrollTop - 1000 &&
            item.y < container.scrollTop + container.clientHeight + 1000
        )
      );

      setVirtualizedData(result);
    };

    updateVirtualizedData();

    container.addEventListener("scroll", updateVirtualizedData);

    return () => {
      container.removeEventListener("scroll", updateVirtualizedData);
    };
  }, [data]);

  return (
    <StyledMasonryContainer
      className={className}
      height={height}
      imageContainerHeight={Math.max(...heights.current)}
      ref={containerEl}
    >
      <div className="photos-container">
        {virtualizedData.map((photos, i) => (
          <div key={i} className="row">
            {photos.map((photo) => (
              <MasonryItem y={photo.y} photo={photo} key={photo.key} />
            ))}
          </div>
        ))}
      </div>
      <div ref={intersectionEl}></div>
      <div className="bottom">
        {isLoading && <Loader />}
        {error && (
          <>
            <Text variant="error">Failed to fetch</Text>
            <Button
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
