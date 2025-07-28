import { useFilters } from './useFilters';
import { Response } from './useAdminData';

export interface UseResponseFiltersResult {
  filteredResponses: Response[];
  paginatedResponses: Response[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}

export const useResponseFilters = (
  responses: Response[],
  itemsPerPage: number = 10
): UseResponseFiltersResult => {
  const {
    filteredData: filteredResponses,
    paginatedData: paginatedResponses,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages
  } = useFilters<Response & Record<string, unknown>>(
    responses as (Response & Record<string, unknown>)[],
    ['name', 'location', 'district', 'gender'], // Search fields
    itemsPerPage
  );

  return {
    filteredResponses,
    paginatedResponses,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages
  };
};
