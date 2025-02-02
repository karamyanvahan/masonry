import { fetchPhoto, fetchPhotos } from "api";
import { PexelsPhotoResponse, PexelsResponse } from "api/types";
import { useEffect, useMemo, useState } from "react";

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
  const [data, setData] = useState<PexelsResponse>();

  useEffect(() => {
    if (skip) {
      return;
    }

    setIsLoading(true);
    fetchPhotos({ page, perPage, search })
      .then((res) => {
        setData(res);
      })
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
