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

const StyledGrid = styled.div<{ height: number }>`
  display: flex;
  gap: 16px;
  font-size: 0;
  height: ${(props) => props.height + "px"};
  & > div {
    flex: 1;
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
          deltaTop = 2000;
          deltaBottom = 1000;
        } else if (dir === "bottom") {
          deltaTop = 1000;
          deltaBottom = 2000;
        } else if (dir === "mid") {
          deltaTop = 1000;
          deltaBottom = 1000;
        }

        //this could be optimized by taking in count that the elements y position by which we filter them is sorted
        const result = data.map((row) =>
          row.filter(
            (item) =>
              item.y > container.scrollTop - deltaTop &&
              item.y <
                container.scrollTop + container.clientHeight + deltaBottom
          )
        );
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
        if (Math.abs(scrollDiffDelayed) < 20) {
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
          <div key={i} className="row">
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
