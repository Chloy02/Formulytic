"use client";

import React, { useEffect } from 'react';
import styled from 'styled-components';
import EnhancedNavbar from '../../components/EnhancedNavbar';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { useRouter } from 'next/navigation';
import { theme } from '../../styles/theme';
import { useAdminData } from '../../hooks/useAdminData';
import { useResponseFilters } from '../../hooks/useResponseFilters';
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
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend as RechartsLegend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts';

const PageContainer = styled.div`
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  width: 100%;
  padding: 2rem 1rem;
  margin: 0 auto;
  box-sizing: border-box;
`;

const HeaderCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const HeaderDescription = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
  font-weight: 400;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'color'
})<{ color?: string }>`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
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

const StatChange = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'positive'
})<{ positive?: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.positive ? '#10b981' : '#ef4444'};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
`;

// Missing styled components
const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  font-size: 1rem;
  transition: all ${theme.transitions.fast};
  background: white;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${theme.colors.text.muted};
  }
`;

const SearchContainer = styled(GlassCard)`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  padding: 1.5rem;

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
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
    background-color: ${theme.colors.background.secondary};
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

// Type definitions
interface ResponseData {
  id: string;
  name: string;
  age: number;
  gender: string;
  district: string;
  location: string;
  submittedAt: string;
  status: string;
}

const Title = styled.h1<{ size?: string }>`
  font-size: ${props => props.size === 'lg' ? '2.5rem' : props.size === 'md' ? '1.75rem' : '1.5rem'};
  font-weight: 800;
  background: ${theme.colors.primary.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${props => props.size === 'lg' ? '2rem' : props.size === 'md' ? '1.5rem' : '1.25rem'};
  }
`;

const Subtitle = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: 1.1rem;
  font-weight: 400;
  margin-bottom: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 1rem;
  }
`;

const Grid = styled.div<{ $minWidth?: string }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${props => props.$minWidth || '280px'}, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  font-size: 1rem;
  transition: all ${theme.transitions.fast};
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
  }

  &:disabled {
    background: ${theme.colors.background.secondary};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Button = styled.button<{ variant?: string; size?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: ${props => props.size === 'sm' ? '0.5rem 1rem' : '0.75rem 1.5rem'};
  font-size: ${props => props.size === 'sm' ? '0.875rem' : '1rem'};
  font-weight: 600;
  border: none;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  text-decoration: none;

  ${props => {
    switch (props.variant) {
      case 'success':
        return `
          background: ${theme.colors.success.gradient};
          color: white;
          &:hover {
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.lg};
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.error.gradient};
          color: white;
          &:hover {
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.lg};
          }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.secondary.gradient};
          color: white;
          &:hover {
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.lg};
          }
        `;
      default:
        return `
          background: ${theme.colors.primary.gradient};
          color: white;
          &:hover {
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.lg};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${props => props.size === 'sm' ? '0.5rem 0.75rem' : '0.75rem 1rem'};
    font-size: ${props => props.size === 'sm' ? '0.75rem' : '0.875rem'};
  }
`;

const StatusMessage = styled.div<{ type?: string }>`
  padding: 1rem;
  border-radius: ${theme.borderRadius.md};
  margin-bottom: 1rem;
  font-weight: 500;

  ${props => {
    switch (props.type) {
      case 'error':
        return `
          background: ${theme.colors.error[50]};
          color: ${theme.colors.error[700]};
          border: 1px solid ${theme.colors.error[200]};
        `;
      case 'success':
        return `
          background: ${theme.colors.success[50]};
          color: ${theme.colors.success[700]};
          border: 1px solid ${theme.colors.success[200]};
        `;
      default:
        return `
          background: ${theme.colors.info[50]};
          color: ${theme.colors.info[700]};
          border: 1px solid ${theme.colors.info[200]};
        `;
    }
  }}
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;

  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid ${theme.colors.border.light};
    border-top: 4px solid ${theme.colors.primary[500]};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default function AdminDashboardPage() {
  const { isLoggedIn } = useAuth();
  const { t } = useTranslation(); // Translation hook
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

  if (!isLoggedIn) {
    return null;
  }

  // Colors for charts
  const GENDER_COLORS = ['#4299e1', '#f5576c', '#38f9d7'];
  const DISTRICT_COLORS = ['#764ba2', '#43e97b', '#fa709a', '#fee140', '#f093fb', '#4facfe', '#a8edea', '#fed6e3'];

  // Helper: Prepare gender data for PieChart
  const genderData = [
    { name: 'Male', value: stats.genderDistribution.male },
    { name: 'Female', value: stats.genderDistribution.female },
    { name: 'Other', value: stats.genderDistribution.other },
  ];

  // Helper: Prepare district data for BarChart
  const districtCounts: Record<string, number> = {};
  responses.forEach((r: any) => {
    if (r.district && r.district !== 'N/A') {
      districtCounts[r.district] = (districtCounts[r.district] || 0) + 1;
    }
  });
  const districtData = Object.entries(districtCounts).map(([district, count]) => ({ district, count }));

  // Helper: Prepare age data for Histogram
  const ageBins = [0, 18, 25, 35, 45, 60, 100];
  const ageLabels = ['<18', '18-24', '25-34', '35-44', '45-59', '60+'];
  const ageCounts = Array(ageLabels.length).fill(0);
  responses.forEach((r: any) => {
    const age = Number(r.age);
    for (let i = 0; i < ageBins.length - 1; i++) {
      if (age >= ageBins[i] && age < ageBins[i + 1]) {
        ageCounts[i]++;
        break;
      }
    }
  });
  const ageData = ageLabels.map((label, i) => ({ ageRange: label, count: ageCounts[i] }));

  // Helper: Get unique locations
  const uniqueLocations = Array.from(new Set(responses.map((r: any) => r.location).filter(Boolean)));

  // Event handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <PageContainer>
      <EnhancedNavbar />
      <ContentWrapper>
        <GlassCard>
          <Title size="lg">Admin Dashboard</Title>
          <Subtitle>
            Manage questionnaire responses and view analytics for the SCSP/TSP Impact Evaluation Survey.
          </Subtitle>
        </GlassCard>

        <Grid $minWidth="280px">
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

        {/* --- Visualizations Section --- */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
          {/* Gender Distribution Pie Chart */}
          <div style={{ flex: '1 1 300px', minWidth: 300, background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
            <h3 style={{ textAlign: 'center', marginBottom: 16 }}>Gender Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {genderData.map((entry, idx) => (
                    <Cell key={`cell-gender-${idx}`} fill={GENDER_COLORS[idx % GENDER_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <RechartsLegend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Responses by District Bar Chart */}
          <div style={{ flex: '2 1 400px', minWidth: 400, background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
            <h3 style={{ textAlign: 'center', marginBottom: 16 }}>Responses by District</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={districtData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="district" angle={-30} textAnchor="end" interval={0} height={60} />
                <YAxis allowDecimals={false} />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#764ba2">
                  {districtData.map((entry, idx) => (
                    <Cell key={`cell-district-${idx}`} fill={DISTRICT_COLORS[idx % DISTRICT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Age Distribution Histogram */}
          <div style={{ flex: '1 1 300px', minWidth: 300, background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
            <h3 style={{ textAlign: 'center', marginBottom: 16 }}>Age Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ageData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ageRange" />
                <YAxis allowDecimals={false} />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#43e97b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* --- End Visualizations Section --- */}

        <SearchContainer>
          <SearchIconWrapper>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search by name, location, or district..."
              value={searchTerm}
              onChange={handleSearchChange}
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
            {uniqueLocations.map((location: string) => (
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
                  {paginatedResponses.map((response: ResponseData) => (
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
