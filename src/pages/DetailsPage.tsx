import styled from "styled-components";
import { usePhoto } from "hooks/photos";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { Image } from "components/Image";
import { Loader } from "components/Loader";
import { Container } from "components/Container";
import { Masonry } from "components/Masonry";
import { useEffect, useState } from "react";

const StyledContainer = styled.div<{ $imageAspectRatio?: number }>`
  .top {
    height: calc(100vh - 90px);
    padding-bottom: 50px;
    display: flex;
    gap: 10px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .image-wrapper {
    border-radius: 14px;
    overflow: hidden;
    aspect-ratio: ${({ $imageAspectRatio }) => $imageAspectRatio ?? ""};
  }

  .info {
    text-align: center;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
`;

export const DetailsPage: React.FC = () => {
  const params = useParams();
  const {
    data,
    isLoading: isDataLoading,
    error,
  } = usePhoto({ id: params.id! });
  const [searchParams] = useSearchParams();
  const [isImageLoading, setIsImageLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    document.body.scrollTo({
      top: 0,
      behavior: "instant",
    });
    setIsImageLoading(true);
  }, [params.id]);

  if (error) {
    if (error.status === 404) {
      navigate("/not-found", { replace: true });
    } else {
      navigate("/something-went-wrong", { replace: true });
    }
  }

  return (
    <StyledContainer
      $imageAspectRatio={data ? data.width / data.height : undefined}
    >
      <Container>
        <div className="top">
          <div className="image-wrapper">
            {data && !isDataLoading && (
              <Image
                onLoad={() => setIsImageLoading(false)}
                style={{ display: isImageLoading ? "none" : "block" }}
                fullWidth
                fetchPriority="high"
                src={data.src?.large2x}
                smallSrc={data.src?.large}
                alt={data.alt}
                width={data.width}
                height={data.height}
                placeholderColor={data.avg_color}
              />
            )}
          </div>
          {isDataLoading || isImageLoading ? (
            <Loader />
          ) : (
            <div className="info">
              <h1>{data?.alt}</h1>
              <a href={data?.photographer_url} target="_blank">
                <h3>{data?.photographer}</h3>
              </a>
            </div>
          )}
        </div>
      </Container>
      <div className="masonry-container">
        <Masonry
          height="calc(100vh - 90px)"
          searchQuery={searchParams.get("q") ?? ""}
        />
      </div>
    </StyledContainer>
  );
};
