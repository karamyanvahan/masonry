import { usePhoto } from "hooks/photos";
import { useParams } from "react-router";
import { Image } from "components/Image";
import styled from "styled-components";
import { Masonry } from "components/Masonry";
import { Loader } from "components/Loader";

const StyledContainer = styled.div`
  display: flex;
  align-items: start;
  gap: 16px;

  .img {
    flex: 1;
    padding-top: 10px;
    img {
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
  const { data, isLoading } = usePhoto({ id: params.id! });

  return (
    <StyledContainer>
      <div className="img">
        {data && !isLoading ? (
          <Image
            fetchPriority="high"
            src={data.src?.large2x}
            alt={data.alt}
            width={data.width}
            height={data.height}
            placeholderColor={data.avg_color}
          />
        ) : (
          <Loader />
        )}
      </div>
      <div className="right">
        <div className="info">
          {data && !isLoading && (
            <>
              <h1>{data.alt}</h1>
              <h3>{data.photographer}</h3>
            </>
          )}
        </div>
        <Masonry className="grid" selfScroll />
      </div>
    </StyledContainer>
  );
};
