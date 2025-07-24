"use client";

import React, { useState, useEffect, useCallback } from 'react';
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

const StatCard = styled.div<{ color?: string }>`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color || 'linear-gradient(90deg, #667eea, #764ba2)'};
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div<{ color?: string }>`
  width: 3.5rem;
  height: 3.5rem;
  background: ${props => props.color || 'linear-gradient(135deg, #667eea, #764ba2)'};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  
  svg {
    color: white;
    font-size: 1.5rem;
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
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

const TableCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const TableTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
`;

const TableHeader = styled.th`
  background: linear-gradient(135deg, #667eea, #764ba2);
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
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
  font-weight: 500;
`;

const TableRow = styled.tr`
  background-color: white;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f8fafc;
    transform: scale(1.01);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }

  &.danger {
    background: linear-gradient(135deg, #f093fb, #f5576c);
    
    &:hover {
      box-shadow: 0 5px 15px rgba(245, 87, 108, 0.4);
    }
  }
`;

const ExportButton = styled.button`
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  color: #fff;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(67, 233, 123, 0.4);
  }
`;

const SearchContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SearchInputContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 300px;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 15px;
  font-size: 1rem;
  background-color: #fff;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
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
  color: #9ca3af;
  z-index: 1;
  font-size: 1.1rem;
`;

const FilterSelect = styled.select`
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 15px;
  font-size: 1rem;
  background-color: #fff;
  min-width: 150px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }
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
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #374151;
  }
  
  p {
    font-size: 1rem;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  background-color: #fff;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover:not(:disabled) {
    background-color: #f8fafc;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ResultsInfo = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

interface Response {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  district: string;
  rating: string;
  submittedAt: string;
  status: string;
  answers: Record<string, unknown>;
}

interface Stats {
  totalResponses: number;
  recentSubmissions: number;
  avgAge: number;
  topLocation: string;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  completionRate: number;
  avgResponseTime: number;
  totalDistricts: number;
}

export default function AdminDashboardPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [responses, setResponses] = useState<Response[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState<Stats>({
    totalResponses: 0,
    recentSubmissions: 0,
    avgAge: 0,
    topLocation: '',
    genderDistribution: {
      male: 0,
      female: 0,
      other: 0
    },
    completionRate: 0,
    avgResponseTime: 0,
    totalDistricts: 0
  });

  const itemsPerPage = 10;

  // Search and filter effects
  useEffect(() => {
    let filtered = [...responses];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(response =>
        response.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.district.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply gender filter
    if (filterGender) {
      filtered = filtered.filter(response => response.gender === filterGender);
    }

    // Apply location filter
    if (filterLocation) {
      filtered = filtered.filter(response => 
        response.location === filterLocation || response.district === filterLocation
      );
    }

    setFilteredResponses(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, filterGender, filterLocation, responses]);

  // Get unique locations for filter dropdown
  const uniqueLocations = [...new Set(responses.map(r => r.district || r.location))].filter(Boolean);

  // Pagination logic
  const totalPages = Math.ceil(filteredResponses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResponses = filteredResponses.slice(startIndex, endIndex);

  const calculateStats = useCallback((responses: Response[]) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentSubmissions = responses.filter(r => {
      const submissionDate = new Date(r.submittedAt);
      return submissionDate >= sevenDaysAgo;
    }).length;

    const totalAge = responses.reduce((sum, r) => sum + (typeof r.age === 'number' ? r.age : 0), 0);
    const avgAge = responses.length > 0 ? Math.round(totalAge / responses.length) : 0;

    const genderDistribution = responses.reduce((acc, r) => {
      const gender = r.gender.toLowerCase();
      if (gender === 'male') acc.male++;
      else if (gender === 'female') acc.female++;
      else acc.other++;
      return acc;
    }, { male: 0, female: 0, other: 0 });

    // Find most common location
    const locationCounts = responses.reduce((acc: Record<string, number>, r) => {
      const location = r.district || r.location;
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});
    
    const topLocation = Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    const uniqueDistricts = new Set(responses.map(r => r.district || r.location)).size;
    const completionRate = responses.length > 0 ? 95 : 0; // Mock completion rate
    const avgResponseTime = 12; // Mock average response time in minutes

    setStats({
      totalResponses: responses.length,
      recentSubmissions,
      avgAge,
      topLocation,
      genderDistribution,
      completionRate,
      avgResponseTime,
      totalDistricts: uniqueDistricts
    });
  }, []);

  const loadSampleData = useCallback(() => {
    const sampleResponses: Response[] = [
      {
        id: '1',
        name: 'John Doe',
        age: 28,
        gender: 'Male',
        location: 'Bangalore Urban',
        district: 'Bangalore Urban',
        rating: 'N/A',
        submittedAt: '2025-01-20',
        status: 'submitted',
        answers: {}
      },
      {
        id: '2',
        name: 'Jane Smith',
        age: 34,
        gender: 'Female',
        location: 'Mysore',
        district: 'Mysore',
        rating: 'N/A',
        submittedAt: '2025-01-19',
        status: 'submitted',
        answers: {}
      },
      {
        id: '3',
        name: 'Raj Kumar',
        age: 42,
        gender: 'Male',
        location: 'Hubli',
        district: 'Hubli-Dharwad',
        rating: 'N/A',
        submittedAt: '2025-01-18',
        status: 'submitted',
        answers: {}
      }
    ];

    setResponses(sampleResponses);
    setFilteredResponses(sampleResponses);
    calculateStats(sampleResponses);
  }, [calculateStats]);

  const loadResponsesFromBackend = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/responses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Transform the data to match our interface
        const transformedResponses = data.map((item: any) => {
          const answers = item.answers as any;
          const section1 = answers?.section1 as any;
          
          return {
            id: item._id || Math.random().toString(),
            name: section1?.respondentName || 'N/A',
            age: section1?.age || 0,
            gender: section1?.gender || 'N/A',
            location: section1?.district || 'N/A',
            district: section1?.district || 'N/A',
            rating: 'N/A', // We don't have rating in the current data structure
            submittedAt: new Date(item.submissionDate || Date.now()).toLocaleDateString(),
            status: item.status || 'submitted',
            answers: item.answers
          };
        });
        
        setResponses(transformedResponses);
        setFilteredResponses(transformedResponses);
        calculateStats(transformedResponses);
      } else {
        // If not authorized or error, fall back to sample data
        loadSampleData();
      }
    } catch (error) {
      console.error('Failed to load responses:', error);
      // Fall back to sample data
      loadSampleData();
    } finally {
      setLoading(false);
    }
  }, [calculateStats, loadSampleData]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/signin');
      return;
    }
    
    // Load real data from backend
    loadResponsesFromBackend();
  }, [isLoggedIn, router, loadResponsesFromBackend]);

  const handleExportData = () => {
    // Convert filtered data to CSV
    const headers = ['Name', 'Age', 'Gender', 'District', 'Location', 'Submitted At', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredResponses.map(r => [
        r.name,
        r.age,
        r.gender,
        r.district,
        r.location,
        r.submittedAt,
        r.status
      ].join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `questionnaire_responses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDeleteResponse = async (id: string) => {
    if (confirm('Are you sure you want to delete this response?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/responses/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          // Remove from local state
          setResponses(prev => prev.filter(r => r.id !== id));
          alert('Response deleted successfully');
        } else {
          alert('Failed to delete response');
        }
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete response');
      }
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <PageContainer>
      <Navbar2 />
      <ContentWrapper>
        <HeaderCard>
          <HeaderTitle>Admin Dashboard</HeaderTitle>
          <HeaderDescription>
            Manage questionnaire responses and view analytics for the SCSP/TSP Impact Evaluation Survey.
          </HeaderDescription>
        </HeaderCard>

        <StatsGrid>
          <StatCard color="linear-gradient(135deg, #667eea, #764ba2)">
            <StatHeader>
              <div>
                <StatNumber>{stats.totalResponses}</StatNumber>
                <StatLabel>Total Responses</StatLabel>
                <StatChange positive={true}>
                  <FiTrendingUp /> +12% this month
                </StatChange>
              </div>
              <StatIcon color="linear-gradient(135deg, #667eea, #764ba2)">
                <FiUsers />
              </StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard color="linear-gradient(135deg, #f093fb, #f5576c)">
            <StatHeader>
              <div>
                <StatNumber>{stats.recentSubmissions}</StatNumber>
                <StatLabel>Recent Submissions</StatLabel>
                <StatChange positive={true}>
                  <FiTrendingUp /> Last 7 days
                </StatChange>
              </div>
              <StatIcon color="linear-gradient(135deg, #f093fb, #f5576c)">
                <FiClock />
              </StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard color="linear-gradient(135deg, #4facfe, #00f2fe)">
            <StatHeader>
              <div>
                <StatNumber>{stats.completionRate}%</StatNumber>
                <StatLabel>Completion Rate</StatLabel>
                <StatChange positive={true}>
                  <FiTrendingUp /> +5% from last month
                </StatChange>
              </div>
              <StatIcon color="linear-gradient(135deg, #4facfe, #00f2fe)">
                <FiBarChart />
              </StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard color="linear-gradient(135deg, #43e97b, #38f9d7)">
            <StatHeader>
              <div>
                <StatNumber>{stats.totalDistricts}</StatNumber>
                <StatLabel>Districts Covered</StatLabel>
                <StatChange positive={true}>
                  <FiMapPin /> Across Karnataka
                </StatChange>
              </div>
              <StatIcon color="linear-gradient(135deg, #43e97b, #38f9d7)">
                <FiGlobe />
              </StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard color="linear-gradient(135deg, #fa709a, #fee140)">
            <StatHeader>
              <div>
                <StatNumber>{stats.avgAge}</StatNumber>
                <StatLabel>Average Age</StatLabel>
                <StatChange positive={false}>
                  <FiUserCheck /> Years old
                </StatChange>
              </div>
              <StatIcon color="linear-gradient(135deg, #fa709a, #fee140)">
                <FiUserCheck />
              </StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard color="linear-gradient(135deg, #a8edea, #fed6e3)">
            <StatHeader>
              <div>
                <StatNumber>{stats.totalResponses > 0 ? Math.round((stats.genderDistribution.female / stats.totalResponses) * 100) : 0}%</StatNumber>
                <StatLabel>Female Respondents</StatLabel>
                <StatChange positive={true}>
                  <FiHeart /> Gender diversity
                </StatChange>
              </div>
              <StatIcon color="linear-gradient(135deg, #a8edea, #fed6e3)">
                <FiHeart />
              </StatIcon>
            </StatHeader>
          </StatCard>
        </StatsGrid>

        <SearchContainer>
          <SearchInputContainer>
            <SearchIconWrapper>
              <SearchIcon />
              <SearchInput
                type="text"
                placeholder="Search by name, location, or district..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchIconWrapper>
            
            <FilterSelect
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </FilterSelect>
            
            <FilterSelect
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </FilterSelect>
          </SearchInputContainer>
          
          <ResultsInfo>
            Showing {filteredResponses.length} of {responses.length} responses
          </ResultsInfo>
        </SearchContainer>

        <TableCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <TableTitle>Questionnaire Responses</TableTitle>
            <ExportButton onClick={handleExportData}>
              <FiDownload />
              Export Data
            </ExportButton>
          </div>
          
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
                  {currentResponses.map((response) => (
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
                        <ActionButton>
                          <FiEye />
                          View
                        </ActionButton>
                        <ActionButton 
                          className="danger"
                          onClick={() => handleDeleteResponse(response.id)}
                        >
                          <FiTrash2 />
                          Delete
                        </ActionButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
              
              <PaginationContainer>
                <PaginationButton
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </PaginationButton>
                
                <ResultsInfo>
                  Page {currentPage} of {totalPages}
                </ResultsInfo>
                
                <PaginationButton
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </PaginationButton>
              </PaginationContainer>
            </>
          )}
        </TableCard>
      </ContentWrapper>
    </PageContainer>
  );
}
