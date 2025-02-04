import styled from "styled-components";
import { usePhoto } from "hooks/photos";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { Image } from "components/Image";
import { Loader } from "components/Loader";
import { Container } from "components/Container";
import { Masonry } from "components/Masonry";
import { useEffect } from "react";

const StyledContainer = styled.div`
  .top {
    min-height: calc(100vh - 90px);
  }
  .img-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 200px);
  }
  .image-wrapper {
    width: max-content;
    border-radius: 14px;
    overflow: hidden;
    height: calc(100vh - 200px);
  }

  .info {
    text-align: center;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  h3 {
    color: ${(props) => props.theme.default};
  }

  .masonry-container {
    margin-top: 20px;
  }
`;

export const DetailsPage: React.FC = () => {
  const params = useParams();
  const { data, isLoading, error } = usePhoto({ id: params.id! });
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    document.body.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [params.id]);

  if (error) {
    if (error.status === 404) {
      navigate("/not-found", { replace: true });
    } else {
      navigate("/something-went-wrong", { replace: true });
    }
  }

  return (
    <StyledContainer>
      <Container>
        <div className="top">
          <div className="img-container">
            {data && !isLoading && (
              <div className="image-wrapper">
                <Image
                  fullHeight
                  fetchPriority="high"
                  src={data.src?.large2x}
                  smallSrc={data.src?.large}
                  alt={data.alt}
                  width={data.width}
                  height={data.height}
                  placeholderColor={data.avg_color}
                />
              </div>
            )}
            {isLoading && <Loader />}
          </div>
          <div className="info">
            {!isLoading && (
              <>
                <h1>{data?.alt}</h1>
                <a href={data?.photographer_url} target="_blank">
                  <h3>{data?.photographer}</h3>
                </a>
              </>
            )}
          </div>
        </div>
      </Container>
      <div className="masonry-container">
        <Masonry
          height="calc(100vh - 90px)"
          className="grid"
          searchQuery={searchParams.get("q") ?? ""}
        />
      </div>
    </StyledContainer>
  );
};
