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
  padding-inline: 16px;

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
  const rawData = useRef<PexelsPhotoResponse[]>([]);
  const heights = useRef<number[] | null>(null);
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

  const normalizeData = useCallback((data: PexelsPhotoResponse[]) => {
    const colCount = Math.max(
      Math.floor((containerEl.current?.clientWidth ?? 0) / colWidth),
      3
    );

    const result: DataItem[][] = new Array(colCount).fill(1).map(() => []);

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
      });
      heights.current![mostEmptyIndex] += itemHeight + gap;
    });

    return result;
  }, []);

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

  useEffect(() => {
    heights.current = null;
    setData([]);
    rawData.current = [];
    setPage(0);
  }, [searchQuery]);

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
      imageContainerHeight={Math.max(...(heights.current ?? [0]))}
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
