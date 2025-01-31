import { PexelsPhotoResponse, PexelsResponse } from "./types";

interface FetchParams {
  page?: number;
  perPage?: number;
}
const authToken = "HiFB93lWrN5DSnjOLyu5JzH1CzY21XAuXUBjrp1vctXjmxmhOPT742r0";

const appFetch = (url: string, options?: RequestInit) => {
  return fetch("https://api.pexels.com/v1" + url, {
    ...options,
    headers: {
      Authorization: authToken,
      ...options?.headers,
    },
  });
};

export const fetchPhotos = ({ page, perPage }: FetchParams) => {
  const searchParams = new URLSearchParams({
    page: page?.toString() ?? "1",
    per_page: perPage?.toString() ?? "30",
  });

  return appFetch("/curated?" + searchParams.toString()).then(
    (res) => res.json() as Promise<PexelsResponse>
  );
};

export const fetchPhoto = (id: string) => {
  return appFetch("/photos/" + id).then(
    (res) => res.json() as Promise<PexelsPhotoResponse>
  );
};
