import { fetchPhoto, fetchPhotos } from "api";
import { PexelsPhotoResponse, PexelsResponse } from "api/types";
import { useCallback, useEffect, useMemo, useState } from "react";

export const usePhotos = ({
  page,
  perPage,
  search,
  skip,
}: {
  page: number;
  perPage: number;
  search?: string;
  skip?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<PexelsResponse>();

  const fetch = useCallback(() => {
    setError(null);
    setIsLoading(true);
    fetchPhotos({ page, perPage, search })
      .then((res) => {
        setData(res);
      })
      .catch(setError)
      .finally(() => {
        setIsLoading(false);
      });
  }, [page, perPage, search]);

  useEffect(() => {
    if (skip) {
      return;
    }

    fetch();
  }, [page, perPage]);

  return useMemo(
    () => ({
      data,
      isLoading,
      error,
      fetch,
    }),
    [data, error, fetch, isLoading]
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
