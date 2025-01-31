import { usePhotos } from "hooks/usePhotos";

export const Masonry: React.FC = () => {
  const { data } = usePhotos({
    page: 1,
    perPage: 40,
  });

  return data.map((photo) => <img src={photo.src?.medium} alt={photo.alt} />);
};
