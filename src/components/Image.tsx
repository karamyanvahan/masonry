import { ImgHTMLAttributes, useEffect, useRef, useState } from "react";
import styled from "styled-components";

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  placeholderColor?: string;
  width: number;
  height: number;
  smallSrc?: string;
  isLoading?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
};

interface StyledContainerProps {
  $isLoading?: boolean;
  $fullWidth?: boolean;
  $fullHeight?: boolean;
}

const StyledContainer = styled.div<StyledContainerProps>`
  position: relative;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  height: ${({ $fullHeight }) => ($fullHeight ? "100%" : "auto")};

  img {
    width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
    height: ${({ $fullHeight }) => ($fullHeight ? "100%" : "auto")};
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

// Image component that shows a placeholder while the image is loading and retries loading the image if it fails
export const Image: React.FC<ImageProps> = ({
  placeholderColor,
  height: outerHeight,
  width: outerWidth,
  className,
  style,
  src,
  fullHeight,
  fullWidth,
  smallSrc,
  onLoad,
  fetchPriority,
  ...imageProps
}) => {
  const imageEl = useRef<HTMLImageElement>(null);
  const retryCount = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (fullWidth && imageEl.current?.clientWidth) {
      setHeight((imageEl.current.clientWidth / outerWidth) * outerHeight);
    }

    if (fullHeight && imageEl.current?.clientHeight) {
      setWidth((imageEl.current.clientHeight / outerHeight) * outerWidth);
    }
  }, [fullHeight, fullWidth, outerHeight, outerWidth]);

  useEffect(() => {
    if (!hasError) {
      return;
    }

    let intervalId: number | null = null;
    intervalId = setInterval(() => {
      if (retryCount.current > 5) {
        clearInterval(intervalId!);
      }
      if (navigator.onLine) {
        setImageSrc("");
        setTimeout(() => {
          setImageSrc(src);
          retryCount.current++;
        });
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasError]);

  return (
    <StyledContainer
      $isLoading={isLoading}
      $fullHeight={fullHeight}
      $fullWidth={fullWidth}
      style={{
        ...style,
        height: isLoading && fullWidth ? height : undefined,
        width: isLoading && fullHeight ? width : undefined,
      }}
      className={className}
    >
      <div
        className="placeholder"
        style={{
          backgroundColor: placeholderColor,
        }}
      ></div>
      <picture>
        {smallSrc && <source media="(max-width: 400px)" srcSet={smallSrc} />}
        <img
          {...imageProps}
          fetchPriority={fetchPriority}
          width={width}
          height={height}
          ref={imageEl}
          src={imageSrc}
          onLoad={(e) => {
            setHasError(false);
            setIsLoading(false);
            onLoad?.(e);
          }}
          onError={() => {
            setHasError(true);
          }}
        />
      </picture>
    </StyledContainer>
  );
};
