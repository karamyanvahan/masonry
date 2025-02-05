import { env } from "env";
import { PexelsPhotoResponse, PexelsResponse } from "./types";

interface FetchPhotosParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export class HttpError {
  constructor(public status: number) {}
}

const appFetch = (url: string, options?: RequestInit) => {
  return fetch("https://api.pexels.com/v1" + url, {
    ...options,
    headers: {
      Authorization: env.apiToken,
      ...options?.headers,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new HttpError(response.status);
    }
    return response;
  });
};

export const fetchPhotos = ({ page, perPage, search }: FetchPhotosParams) => {
  const searchParams = new URLSearchParams({
    page: page?.toString() ?? "1",
    per_page: perPage?.toString() ?? "80",
  });

  if (search) {
    searchParams.append("query", search);

    return appFetch("/search?" + searchParams.toString()).then(
      (res) => res.json() as Promise<PexelsResponse>
    );
  }
  return appFetch("/curated?" + searchParams.toString()).then(
    (res) => res.json() as Promise<PexelsResponse>
  );
};

export const fetchPhoto = (id: string) => {
  return appFetch("/photos/" + id).then(
    (res) => res.json() as Promise<PexelsPhotoResponse>
  );
};
