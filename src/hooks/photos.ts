import { fetchPhoto, fetchPhotos } from "api";
import { PexelsPhotoResponse } from "api/types";
import { useEffect, useMemo, useState } from "react";

export const usePhotos = ({
  page,
  perPage,
}: {
  page: number;
  perPage: number;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<PexelsPhotoResponse[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetchPhotos({ page, perPage })
      .then((data) => setData((prev) => [...prev, ...data.photos]))
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
