import { forwardRef, ImgHTMLAttributes, useState } from "react";
import styled from "styled-components";

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  placeholderColor?: string;
}

const StyledContainer = styled.div<{ $isLoading: boolean }>`
  position: relative;
  img {
    width: 100%;
  }

  .placeholder {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: opacity 0.2s;
    opacity: ${(props) => (props.$isLoading ? 1 : 0)};
  }
`;

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ placeholderColor, height, ...imageProps }, ref) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
      <StyledContainer $isLoading={isLoading} style={{ height: height }}>
        <div
          className="placeholder"
          style={{
            backgroundColor: placeholderColor,
          }}
        ></div>
        <img
          ref={ref}
          {...imageProps}
          onLoad={() => {
            setIsLoading(false);
          }}
        />
      </StyledContainer>
    );
  }
);
