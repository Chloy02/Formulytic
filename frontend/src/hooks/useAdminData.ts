import { useState, useCallback } from 'react';
import ServerLink from '../lib/api/serverURL';

export interface Response {
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

export interface Stats {
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
  totalDrafts: number;
}

export const useAdminData = () => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [allResponses, setAllResponses] = useState<Response[]>([]); // Store all responses for export
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalResponses: 0,
    recentSubmissions: 0,
    avgAge: 0,
    topLocation: '',
    genderDistribution: { male: 0, female: 0, other: 0 },
    completionRate: 0,
    avgResponseTime: 0,
    totalDistricts: 0,
    totalDrafts: 0
  });

  const calculateStats = useCallback((allResponses: Response[]) => {
    // Separate completed responses from drafts
    const completedResponses = allResponses.filter(r => 
      r.status === 'submitted' || r.status === 'completed'
    );
    const draftResponses = allResponses.filter(r => 
      r.status === 'draft' || r.status === 'pending'
    );
    
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentSubmissions = completedResponses.filter(r => 
      new Date(r.submittedAt) >= sevenDaysAgo
    ).length;

    const totalAge = completedResponses.reduce((sum, r) => sum + (r.age || 0), 0);
    const avgAge = completedResponses.length > 0 ? Math.round(totalAge / completedResponses.length) : 0;

    const genderDistribution = completedResponses.reduce((acc, r) => {
      const gender = r.gender.toLowerCase();
      if (gender === 'male') acc.male++;
      else if (gender === 'female') acc.female++;
      else acc.other++;
      return acc;
    }, { male: 0, female: 0, other: 0 });

    const locationCounts = completedResponses.reduce((acc: Record<string, number>, r) => {
      const location = r.district || r.location;
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});
    
    const topLocation = Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    const uniqueDistricts = new Set(completedResponses.map(r => r.district || r.location)).size;

    setStats({
      totalResponses: completedResponses.length,
      recentSubmissions,
      avgAge,
      topLocation,
      genderDistribution,
      completionRate: allResponses.length > 0 ? Math.round((completedResponses.length / allResponses.length) * 100) : 0,
      avgResponseTime: 12,
      totalDistricts: uniqueDistricts,
      totalDrafts: draftResponses.length
    });
  }, []);

  const loadResponses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the auth token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No auth token found. Please login as admin.');
        throw new Error('Authentication required. Please login as admin.');
      }
      
      console.log('Attempting to fetch from:', '/api/responses/admin');
      
      // Call the admin endpoint with proper authentication
      const response = await fetch('/api/responses/admin', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 💥 Add authentication header
        }
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Raw API Response:', data);
        
        // Handle the response data structure
        let transformedResponses: Response[] = [];
        
        if (Array.isArray(data)) {
          // Filter out drafts at the API level (backend should do this, but extra safety)
          const submittedResponsesOnly = data.filter((item: any) => 
            item.status === 'submitted' || item.status === 'completed'
          );
          
          transformedResponses = submittedResponsesOnly.map((item: any, index: number) => {
            console.log(`Processing item ${index}:`, item);
            
            // Handle different possible data structures
            const answers = item.answers || {};
            const section1 = answers.section1 || {};
            
            return {
              id: item._id || item.id || `temp-${index}`,
              name: section1.respondentName || section1.uname || item.name || 'N/A',
              age: Number(section1.age || item.age || 0),
              gender: section1.gender || item.gender || 'N/A',
              location: section1.district || section1.location || item.location || 'N/A',
              district: section1.district || item.district || item.location || 'N/A',
              rating: item.rating || 'N/A',
              submittedAt: item.submissionDate ? new Date(item.submissionDate).toLocaleDateString() : 
                          item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 
                          item.createdAt ? new Date(item.createdAt).toLocaleDateString() :
                          new Date().toLocaleDateString(),
              status: 'submitted', // Ensure all displayed responses show as submitted
              answers: answers
            };
          });
        } else {
          console.warn('API returned non-array data:', data);
        }
        
        console.log('Transformed responses:', transformedResponses);
        
        // Store all responses for export
        setAllResponses(transformedResponses);
        
        // All responses are already filtered to be submitted only
        setResponses(transformedResponses);
        
        // Calculate stats using the submitted responses
        calculateStats(transformedResponses);
        
      } else {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load responses';
      setError(errorMessage);
      
      // Fallback to sample data for development
      console.log('Using fallback sample data due to error');
      const sampleData: Response[] = [
        {
          id: '1', name: 'John Doe', age: 28, gender: 'Male',
          location: 'Bangalore Urban', district: 'Bangalore Urban',
          rating: 'N/A', submittedAt: '2025-01-20', status: 'submitted', answers: {}
        },
        {
          id: '2', name: 'Jane Smith', age: 34, gender: 'Female',
          location: 'Mysore', district: 'Mysore',
          rating: 'N/A', submittedAt: '2025-01-19', status: 'submitted', answers: {}
        },
        {
          id: '3', name: 'Raj Kumar', age: 42, gender: 'Male',
          location: 'Hassan', district: 'Hassan',
          rating: 'N/A', submittedAt: '2025-01-18', status: 'submitted', answers: {}
        },
        {
          id: '4', name: 'Priya Singh', age: 25, gender: 'Female',
          location: 'Mangalore', district: 'Dakshina Kannada',
          rating: 'N/A', submittedAt: '2025-01-17', status: 'draft', answers: {}
        },
        {
          id: '5', name: 'Draft User', age: 30, gender: 'Male',
          location: 'Hubli', district: 'Dharwad',
          rating: 'N/A', submittedAt: '2025-01-16', status: 'draft', answers: {}
        }
      ];
      
      setAllResponses(sampleData);
      const completedSampleData = sampleData.filter(r => 
        r.status === 'submitted' || r.status === 'completed'
      );
      setResponses(completedSampleData);
      calculateStats(sampleData);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  const deleteResponse = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/responses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        // Remove from both responses and allResponses
        setResponses(prev => prev.filter(r => r.id !== id));
        setAllResponses(prev => prev.filter(r => r.id !== id));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const viewResponse = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/responses/${id}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        return data.data || data; // Handle both response formats
      }
      return null;
    } catch (error) {
      console.error('Error viewing response:', error);
      return null;
    }
  };

  const exportData = () => {
    // Export all responses with comprehensive questionnaire data
    const headers = [
      'Name', 'Age', 'Gender', 'District', 'Location', 'Submitted At', 'Status',
      'Education Level', 'Caste Category', 'Previous Occupation', 'Current Occupation',
      'Income Before Scheme', 'Current Income', 'Employment Status Before', 'Current Employment Status',
      'Schemes Benefited', 'Date of Benefit', 'Utilization of Benefits', 'Spouse Employment',
      'Socio-Economic Status Before', 'Current Socio-Economic Status', 'Financial Security Rating',
      'Social Life Impact', 'Decision Making', 'Marriage Opposition', 'Relocation After Marriage',
      'Aadhaar Provided', 'Additional Comments'
    ];
    
    const csvContent = [
      headers.join(','),
      ...allResponses.map(r => {
        const answers = r.answers || {};
        const section1 = (answers.section1 as any) || {};
        const section2 = (answers.section2 as any) || {};
        const section3 = (answers.section3 as any) || {};
        const section4 = (answers.section4 as any) || {};
        const section5 = (answers.section5 as any) || {};
        
        // Helper function to handle arrays and objects
        const formatField = (field: any): string => {
          if (Array.isArray(field)) {
            return field.join('; ');
          }
          if (typeof field === 'object' && field !== null) {
            return JSON.stringify(field).replace(/"/g, '""');
          }
          return String(field || '').replace(/"/g, '""');
        };
        
        return [
          formatField(r.name),
          formatField(r.age),
          formatField(r.gender),
          formatField(r.district),
          formatField(r.location),
          formatField(r.submittedAt),
          formatField(r.status),
          formatField(section1.educationLevel),
          formatField(section1.casteCategory),
          formatField(section2.previousOccupation),
          formatField(section2.currentOccupation),
          formatField(section2.incomeBefore),
          formatField(section2.currentIncome),
          formatField(section2.employmentBefore),
          formatField(section2.currentEmployment),
          formatField(section2.schemesBenefited),
          formatField(section2.benefitDate),
          formatField(section2.utilizationOfBenefits),
          formatField(section2.spouseEmployment),
          formatField(section3.socioEconomicStatusBefore),
          formatField(section3.currentSocioEconomicStatus),
          formatField(section3.financialSecurityRating),
          formatField(section4.socialLifeImpact),
          formatField(section4.decisionMaking),
          formatField(section5.marriageOpposition),
          formatField(section5.relocationAfterMarriage),
          formatField(section5.aadhaarProvided),
          formatField(section5.additionalComments)
        ].map(field => `"${field}"`).join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `questionnaire_responses_detailed_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return {
    responses,
    allResponses,
    stats,
    loading,
    error,
    loadResponses,
    deleteResponse,
    viewResponse,
    exportData
  };
};
