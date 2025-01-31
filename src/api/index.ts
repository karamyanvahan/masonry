import { PexelsResponse } from "./types";

interface FetchParams {
  page?: number;
  perPage?: number;
}
const authToken = "HiFB93lWrN5DSnjOLyu5JzH1CzY21XAuXUBjrp1vctXjmxmhOPT742r0";

export const fetchPhotos = ({ page, perPage }: FetchParams) => {
  const searchParams = new URLSearchParams({
    page: page?.toString() ?? "1",
    per_page: perPage?.toString() ?? "30",
  });

  return fetch("https://api.pexels.com/v1/curated?" + searchParams.toString(), {
    headers: {
      Authorization: authToken,
    },
  }).then((res) => res.json() as Promise<PexelsResponse>);
};
