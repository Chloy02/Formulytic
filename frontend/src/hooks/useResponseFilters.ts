import { useState, useEffect } from 'react';
import { Response } from './useAdminData';

export interface UseResponseFiltersResult {
  filteredResponses: Response[];
  paginatedResponses: Response[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export const useResponseFilters = (
  responses: Response[],
  itemsPerPage: number = 10
): UseResponseFiltersResult => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('submitted'); // Default to submitted only
  const [currentPage, setCurrentPage] = useState(1);

  // Custom filtering for Response objects with nested data
  const filteredResponses = responses.filter(response => {
    // Search filter - check multiple fields for name
    const matchesSearch = !searchTerm || (() => {
      const searchLower = searchTerm.toLowerCase();
      
      // Check username from submittedBy
      const username = typeof response.submittedBy === 'object' 
        ? response.submittedBy.username || '' 
        : '';
      
      // Check spouse name from section1
      const spouseName = response.answers?.section1?.spouseName || '';
      
      // Check email from submittedBy
      const email = typeof response.submittedBy === 'object' 
        ? response.submittedBy.email || '' 
        : '';
      
      // Check district and location
      const district = response.answers?.section1?.district || '';
      const location = response.answers?.section1?.residentialAddress || '';
      
      return username.toLowerCase().includes(searchLower) ||
             spouseName.toLowerCase().includes(searchLower) ||
             email.toLowerCase().includes(searchLower) ||
             district.toLowerCase().includes(searchLower) ||
             location.toLowerCase().includes(searchLower);
    })();

    // Status filter
    const matchesStatus = statusFilter === 'all' || response.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredResponses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResponses = filteredResponses.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return {
    filteredResponses,
    paginatedResponses,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    statusFilter,
    setStatusFilter
  };
};
