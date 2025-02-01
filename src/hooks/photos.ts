import { fetchPhoto, fetchPhotos } from "api";
import { PexelsPhotoResponse, PexelsResponse } from "api/types";
import { useCallback, useEffect, useMemo, useState } from "react";

export const usePhotos = ({
  page,
  perPage,
  search,
  lazy,
}: {
  page: number;
  perPage: number;
  search?: string;
  lazy?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<PexelsResponse>();

  const fetch = useCallback(() => {
    setIsLoading(true);
    fetchPhotos({ page, perPage, search })
      .then((res) => {
        setData(res);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page, perPage, search]);

  useEffect(() => {
    if (!lazy) {
      fetch();
    }
  }, [fetch, lazy]);

  return useMemo(
    () => ({
      fetch,
      data,
      isLoading,
    }),
    [data, fetch, isLoading]
  );
};

export const usePhoto = ({ id }: { id: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<PexelsPhotoResponse | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchPhoto(id)
      .then(setData)
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  return useMemo(
    () => ({
      data,
      isLoading,
    }),
    [data, isLoading]
  );
};
