import { fetchPhoto, fetchPhotos } from "api";
import { PexelsPhotoResponse } from "api/types";
import { useEffect, useMemo, useState } from "react";

export const usePhotos = ({
  page,
  perPage,
  search,
}: {
  page: number;
  perPage: number;
  search?: string;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<PexelsPhotoResponse[]>([]);
  const [total, setTotal] = useState<number>();

  useEffect(() => {
    setData([]);
  }, [search]);

  useEffect(() => {
    setIsLoading(true);
    fetchPhotos({ page, perPage, search })
      .then((data) => {
        setData((prev) => [...prev, ...data.photos]);
        setTotal(data.total_results);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page, perPage, search]);

  return useMemo(
    () => ({
      total,
      data,
      isLoading,
    }),
    [data, isLoading, total]
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
