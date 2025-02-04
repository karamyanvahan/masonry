import { PexelsPhotoResponse } from "api/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { MasonryItem } from "./MasonryItem";
import React from "react";
import styled from "styled-components";

export type DataItem = PexelsPhotoResponse & { y: number; key: string };
export type GridData = DataItem[][];
type Direction = "top" | "mid" | "bottom";

interface VirtualizedGridProps {
  data: GridData;
  container: React.RefObject<HTMLDivElement>;
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
  ({ data, container: containerRef, height }) => {
    const scrollDir = useRef<Direction>("mid");
    const lastScrollPosDelayed = useRef(0);
    const [virtualizedData, setVirtualizedData] = useState<GridData>([]);

    const updateVirtualizedData = useCallback(
      (dir: "top" | "bottom" | "mid") => {
        if (!containerRef.current) {
          return;
        }

        let deltaTop = 0;
        let deltaBottom = 0;

        if (dir === "top") {
          deltaTop = 1000;
          deltaBottom = 100;
        } else if (dir === "bottom") {
          deltaTop = 300;
          deltaBottom = 1000;
        } else if (dir === "mid") {
          deltaTop = 500;
          deltaBottom = 500;
        }

        const result = data.map((row) =>
          row.filter(
            (item) =>
              item.y > containerRef.current!.scrollTop - deltaTop &&
              item.y <
                containerRef.current!.scrollTop +
                  containerRef.current!.clientHeight +
                  deltaBottom
          )
        );
        setVirtualizedData(result);
      },
      [containerRef, data]
    );

    useEffect(() => {
      updateVirtualizedData("bottom");
    }, [updateVirtualizedData]);

    useEffect(() => {
      const container = containerRef.current;
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
    }, [containerRef, updateVirtualizedData]);

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

VirtualizedGrid.displayName = "VirtualizedGrid";
