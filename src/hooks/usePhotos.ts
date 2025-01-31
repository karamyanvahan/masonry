import { fetchPhotos } from "api";
import { PexelsPhoto } from "api/types";
import { useEffect, useMemo, useState } from "react";

export const usePhotos = ({
  page,
  perPage,
}: {
  page: number;
  perPage: number;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<PexelsPhoto[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetchPhotos({ page, perPage })
      .then((data) => setData(data.photos))
      .finally(() => {
        setIsLoading(false);
      });
  }, [page, perPage]);

  return useMemo(
    () => ({
      data,
      isLoading,
    }),
    [data, isLoading]
  );
};
