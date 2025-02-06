import { PexelsPhotoResponse } from "api/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { MasonryItem } from "./MasonryItem";
import React from "react";
import styled from "styled-components";

export type DataItem = Omit<PexelsPhotoResponse, "src"> & {
  y: number;
  key: string;
  src: string;
  smallSrc: string;
};
export type GridData = DataItem[][];
type Direction = "top" | "mid" | "bottom";

interface VirtualizedGridProps {
  data: GridData;
  container: HTMLElement | null;
  height: number;
}

const search = (startAt: number, arr: DataItem[], target: number) => {
  let low = startAt;
  let high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid].y === target) {
      return mid;
    }
    if (arr[mid].y < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return low;
};

const StyledGrid = styled.div<{ height: number }>`
  display: flex;
  gap: 16px;
  font-size: 0;
  height: ${(props) => props.height + "px"};
  & > div {
    flex: 1;
  }

  .col {
    position: relative;
  }
`;
export const VirtualizedGrid: React.FC<VirtualizedGridProps> = React.memo(
  ({ data, container, height }) => {
    const scrollDir = useRef<Direction>("mid");
    const lastScrollPosDelayed = useRef(0);
    const [virtualizedData, setVirtualizedData] = useState<GridData>([]);

    //get data that needs to be rendered depending on viewport position and scroll direction
    //depending on scroll position different count of elements will be rendered before or after viewport position
    const updateVirtualizedData = useCallback(
      (dir: "top" | "bottom" | "mid") => {
        if (!container) {
          return;
        }

        let deltaTop = 0;
        let deltaBottom = 0;

        if (dir === "top") {
          deltaTop = 4000;
          deltaBottom = 2000;
        } else if (dir === "bottom") {
          deltaTop = 2000;
          deltaBottom = 4000;
        } else if (dir === "mid") {
          deltaTop = 4000;
          deltaBottom = 4000;
        }

        const result = data.map((col) => {
          const startIdx = search(0, col, container.scrollTop - deltaTop);

          const endIdx = search(
            startIdx,
            col,
            container.scrollTop + container.clientHeight + deltaBottom
          );

          return col.slice(startIdx, endIdx + 1);
        });

        setVirtualizedData(result);
      },
      [container, data]
    );

    useEffect(() => {
      updateVirtualizedData("bottom");
    }, [updateVirtualizedData]);

    //update virtualized data on scroll
    useEffect(() => {
      if (!container) {
        return;
      }
      let lastScrollPos = 0;

      const onScroll = () => {
        scrollDir.current =
          container.scrollTop - lastScrollPos > 0 ? "bottom" : "top";
        lastScrollPos = container.scrollTop;
        const scrollDiffDelayed =
          container.scrollTop - lastScrollPosDelayed.current;
        if (Math.abs(scrollDiffDelayed) < 1000) {
          return;
        }
        lastScrollPosDelayed.current = container.scrollTop;

        updateVirtualizedData(scrollDir.current);
      };

      container.addEventListener("scroll", onScroll);

      return () => {
        container.removeEventListener("scroll", onScroll);
      };
    }, [container, updateVirtualizedData]);

    return (
      <StyledGrid height={height}>
        {virtualizedData.map((photos, i) => (
          <div key={data[i]?.[0]?.id ?? i} className="col">
            {photos.map((photo) => (
              <MasonryItem photo={photo} key={photo.key} />
            ))}
          </div>
        ))}
      </StyledGrid>
    );
  }
);

//display name for react dev tools
VirtualizedGrid.displayName = "VirtualizedGrid";
