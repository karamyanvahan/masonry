import { AiOutlineArrowLeft } from "react-icons/ai";
import styled from "styled-components";
import { usePhoto } from "hooks/photos";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { Image } from "components/Image";
import { Masonry } from "components/Masonry";
import { Loader } from "components/Loader";
import { Container } from "components/Container";

const StyledContainer = styled.div`
  display: flex;
  align-items: start;
  gap: 16px;

  .left {
    flex: 1;
    padding-top: 10px;
    .image-wrapper {
      border-radius: 14px;
      overflow: hidden;
    }
  }

  .right {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 40px;
    justify-content: space-between;
    height: 100vh;

    .info {
      height: 100px;
    }

    .grid {
      flex: 1;
    }
    h1 {
      font-size: 2em;
    }

    h3 {
      font-size: 1.2em;
    }
  }
`;

export const DetailsPage: React.FC = () => {
  const params = useParams();
  const { data, isLoading, error } = usePhoto({ id: params.id! });
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  if (error) {
    if (error.status === 404) {
      navigate("/not-found", { replace: true });
    } else {
      navigate("/something-went-wrong", { replace: true });
    }
  }

  return (
    <Container>
      <StyledContainer>
        <div className="left">
          <Link to={"/?" + searchParams.toString()}>
            <AiOutlineArrowLeft size="40px" />
          </Link>
          {data && !isLoading && (
            <div className="image-wrapper">
              <Image
                fetchPriority="high"
                src={data.src?.large2x}
                alt={data.alt}
                width={data.width}
                height={data.height}
                placeholderColor={data.avg_color}
              />
            </div>
          )}
          {isLoading && <Loader />}
        </div>
        <div className="right">
          <div className="info">
            {!isLoading && (
              <>
                <h1>{data?.alt}</h1>
                <h3>{data?.photographer}</h3>
              </>
            )}
          </div>
          <Masonry
            className="grid"
            selfScroll
            searchQuery={searchParams.get("q") ?? ""}
          />
        </div>
      </StyledContainer>
    </Container>
  );
};
