import { useState, useEffect } from 'react';

export interface UseFiltersResult<T> {
  filteredData: T[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: Record<string, string>;
  setFilter: (key: string, value: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  paginatedData: T[];
}

export const useFilters = <T extends Record<string, unknown>>(
  data: T[],
  searchFields: (keyof T)[],
  itemsPerPage: number = 10
): UseFiltersResult<T> => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);

  const setFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const filteredData = data.filter(item => {
    // Search filter
    const matchesSearch = !searchTerm || searchFields.some(field => 
      String(item[field]).toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Other filters
    const matchesFilters = Object.entries(filters).every(([key, value]) => 
      !value || String(item[key]) === value
    );

    return matchesSearch && matchesFilters;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  return {
    filteredData,
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData
  };
};
