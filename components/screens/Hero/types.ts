import { SEARCH_SERVICES } from "./constants";

export type SearchService = keyof typeof SEARCH_SERVICES;

export type SearchFormValues = {
  identifier: string;
  service: SearchService;
};
