import { ImgHTMLAttributes, useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  placeholderColor?: string;
  width: number;
  height: number;
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

export const Image: React.FC<ImageProps> = ({
  placeholderColor,
  height: outerHeight,
  width: outerWidth,
  className,
  ...imageProps
}) => {
  const imageEl = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [height, setHeight] = useState(0);

  useEffect(() => {
    const setPlaceholderHeight = () => {
      if (imageEl.current?.clientWidth) {
        setHeight((imageEl.current.clientWidth / outerWidth) * outerHeight);
      }
    };
    setPlaceholderHeight();
  }, [outerHeight, outerWidth]);

  return (
    <StyledContainer
      $isLoading={isLoading}
      style={{ height: isLoading ? height : undefined }}
      className={className}
    >
      <div
        className="placeholder"
        style={{
          backgroundColor: placeholderColor,
        }}
      ></div>
      <img
        ref={imageEl}
        {...imageProps}
        onLoad={() => {
          setIsLoading(false);
        }}
      />
    </StyledContainer>
  );
};
