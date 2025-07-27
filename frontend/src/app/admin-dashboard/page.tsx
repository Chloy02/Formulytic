"use client";

import React, { useEffect } from 'react';
import styled from 'styled-components';
import Navbar2 from '../../components/Navbar2';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  FiSearch, 
  FiDownload, 
  FiEye, 
  FiTrash2, 
  FiUsers, 
  FiUserCheck,
  FiTrendingUp,
  FiMapPin,
  FiClock,
  FiBarChart,
  FiGlobe,
  FiHeart
} from 'react-icons/fi';
import { 
  PageContainer, 
  ContentWrapper, 
  GlassCard, 
  Title, 
  Subtitle, 
  Grid, 
  Button, 
  Input, 
  Select,
  LoadingSpinner,
  StatusMessage
} from '../../styles/components';
import { theme } from '../../styles/theme';
import { useAdminData, Response } from '../../hooks/useAdminData';

// Simple filtering hook for responses
const useResponseFilters = (responses: Response[], itemsPerPage = 10) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);

  // Filter responses based on search term
  const filteredResponses = responses.filter(response => {
    const searchLower = searchTerm.toLowerCase();
    return (
      response.name.toLowerCase().includes(searchLower) ||
      response.location.toLowerCase().includes(searchLower) ||
      response.district.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredResponses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResponses = filteredResponses.slice(startIndex, startIndex + itemsPerPage);

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

// Custom components for admin dashboard
const StatCard = styled(GlassCard)<{ color?: string }>`
  position: relative;
  overflow: hidden;
  padding: 2rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color || theme.colors.primary.gradient};
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div<{ color?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 15px;
  background: ${props => props.color || theme.colors.primary.gradient};
  color: white;
  font-size: 1.5rem;
  box-shadow: ${theme.shadows.sm};
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${theme.colors.text.primary};
  margin-bottom: 0.5rem;
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${theme.colors.text.secondary};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatChange = styled.div<{ positive?: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.positive ? '#10b981' : '#ef4444'};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
`;

const SearchContainer = styled(GlassCard)`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchIconWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.text.muted};
  z-index: 1;
  font-size: 1.1rem;
`;

const SearchInput = styled(Input)`
  padding-left: 3rem;
  min-width: 300px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadows.sm};
`;

const TableHeader = styled.th`
  background: ${theme.colors.primary.gradient};
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${theme.colors.border.light};
  color: ${theme.colors.text.primary};
  font-weight: 500;
`;

const TableRow = styled.tr`
  background-color: white;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${theme.colors.background.light};
    transform: scale(1.01);
    box-shadow: ${theme.shadows.sm};
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${theme.colors.border.light};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${theme.colors.text.secondary};
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: ${theme.colors.text.primary};
  }
`;

export default function AdminDashboardPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const { responses, stats, loading, error, loadResponses, deleteResponse, exportData } = useAdminData();
  const {
    filteredResponses,
    paginatedResponses,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages
  } = useResponseFilters(responses, 10);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/signin');
      return;
    }
    loadResponses();
  }, [isLoggedIn, router, loadResponses]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this response?')) {
      const success = await deleteResponse(id);
      if (!success) {
        alert('Failed to delete response');
      }
    }
  };

  const uniqueLocations = [...new Set(responses.map(r => r.district || r.location))].filter(Boolean);

  if (!isLoggedIn) return null;

  return (
    <PageContainer>
      <Navbar2 />
      <ContentWrapper>
        <GlassCard>
          <Title size="lg">Admin Dashboard</Title>
          <Subtitle>
            Manage questionnaire responses and view analytics for the SCSP/TSP Impact Evaluation Survey.
          </Subtitle>
        </GlassCard>

        <Grid minWidth="280px">
          <StatCard color={theme.colors.primary.gradient}>
            <StatHeader>
              <div>
                <StatNumber>{stats.totalResponses}</StatNumber>
                <StatLabel>Total Responses</StatLabel>
                <StatChange positive={true}>
                  <FiTrendingUp /> +12% this month
                </StatChange>
              </div>
              <StatIcon color={theme.colors.primary.gradient}>
                <FiUsers />
              </StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard color={theme.colors.secondary.gradient}>
            <StatHeader>
              <div>
                <StatNumber>{stats.recentSubmissions}</StatNumber>
                <StatLabel>Recent Submissions</StatLabel>
                <StatChange positive={true}>
                  <FiTrendingUp /> Last 7 days
                </StatChange>
              </div>
              <StatIcon color={theme.colors.secondary.gradient}>
                <FiClock />
              </StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard color={theme.colors.info.gradient}>
            <StatHeader>
              <div>
                <StatNumber>{stats.completionRate}%</StatNumber>
                <StatLabel>Completion Rate</StatLabel>
                <StatChange positive={true}>
                  <FiTrendingUp /> +5% from last month
                </StatChange>
              </div>
              <StatIcon color={theme.colors.info.gradient}>
                <FiBarChart />
              </StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard color={theme.colors.success.gradient}>
            <StatHeader>
              <div>
                <StatNumber>{stats.totalDistricts}</StatNumber>
                <StatLabel>Districts Covered</StatLabel>
                <StatChange positive={true}>
                  <FiMapPin /> Across Karnataka
                </StatChange>
              </div>
              <StatIcon color={theme.colors.success.gradient}>
                <FiGlobe />
              </StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard color={theme.colors.warning.gradient}>
            <StatHeader>
              <div>
                <StatNumber>{stats.avgAge}</StatNumber>
                <StatLabel>Average Age</StatLabel>
                <StatChange positive={false}>
                  <FiUserCheck /> Years old
                </StatChange>
              </div>
              <StatIcon color={theme.colors.warning.gradient}>
                <FiUserCheck />
              </StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard color={theme.colors.neutral.gradient}>
            <StatHeader>
              <div>
                <StatNumber>
                  {stats.totalResponses > 0 
                    ? Math.round((stats.genderDistribution.female / stats.totalResponses) * 100) 
                    : 0}%
                </StatNumber>
                <StatLabel>Female Respondents</StatLabel>
                <StatChange positive={true}>
                  <FiHeart /> Gender diversity
                </StatChange>
              </div>
              <StatIcon color={theme.colors.neutral.gradient}>
                <FiHeart />
              </StatIcon>
            </StatHeader>
          </StatCard>
        </Grid>

        <SearchContainer>
          <SearchIconWrapper>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search by name, location, or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchIconWrapper>
          
          <Select disabled>
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Select>
          
          <Select disabled>
            <option value="">All Locations</option>
            {uniqueLocations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </Select>
        </SearchContainer>

        <GlassCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <Title size="md">Questionnaire Responses</Title>
            <Button variant="success" onClick={() => exportData(filteredResponses)}>
              <FiDownload />
              Export Data
            </Button>
          </div>
          
          {error && <StatusMessage type="error">{error}</StatusMessage>}
          
          {loading ? (
            <LoadingSpinner />
          ) : filteredResponses.length === 0 ? (
            <EmptyState>
              <h3>No responses found</h3>
              <p>Try adjusting your search criteria or check back later.</p>
            </EmptyState>
          ) : (
            <>
              <Table>
                <thead>
                  <tr>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Age</TableHeader>
                    <TableHeader>Gender</TableHeader>
                    <TableHeader>District</TableHeader>
                    <TableHeader>Submitted</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {paginatedResponses.map((response: Response) => (
                    <TableRow key={response.id}>
                      <TableCell>{response.name}</TableCell>
                      <TableCell>{response.age}</TableCell>
                      <TableCell>{response.gender}</TableCell>
                      <TableCell>{response.district}</TableCell>
                      <TableCell>{response.submittedAt}</TableCell>
                      <TableCell>
                        <span style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '0.25rem', 
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: response.status === 'submitted' ? '#d4edda' : '#fff3cd',
                          color: response.status === 'submitted' ? '#155724' : '#856404'
                        }}>
                          {response.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" style={{ marginRight: '0.5rem' }}>
                          <FiEye />
                          View
                        </Button>
                        <Button 
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(response.id)}
                        >
                          <FiTrash2 />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
              
              <PaginationContainer>
                <Button
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <span style={{ color: theme.colors.text.secondary, fontSize: '0.875rem' }}>
                  Page {currentPage} of {totalPages} | Showing {filteredResponses.length} of {responses.length} responses
                </span>
                
                <Button
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </PaginationContainer>
            </>
          )}
        </GlassCard>
      </ContentWrapper>
    </PageContainer>
  );
}
