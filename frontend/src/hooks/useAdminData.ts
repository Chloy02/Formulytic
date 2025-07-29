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
}

export const useAdminData = () => {
  const [responses, setResponses] = useState<Response[]>([]);
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
    totalDistricts: 0
  });

  const calculateStats = useCallback((responses: Response[]) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentSubmissions = responses.filter(r => 
      new Date(r.submittedAt) >= sevenDaysAgo
    ).length;

    const totalAge = responses.reduce((sum, r) => sum + (r.age || 0), 0);
    const avgAge = responses.length > 0 ? Math.round(totalAge / responses.length) : 0;

    const genderDistribution = responses.reduce((acc, r) => {
      const gender = r.gender.toLowerCase();
      if (gender === 'male') acc.male++;
      else if (gender === 'female') acc.female++;
      else acc.other++;
      return acc;
    }, { male: 0, female: 0, other: 0 });

    const locationCounts = responses.reduce((acc: Record<string, number>, r) => {
      const location = r.district || r.location;
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});
    
    const topLocation = Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    const uniqueDistricts = new Set(responses.map(r => r.district || r.location)).size;

    setStats({
      totalResponses: responses.length,
      recentSubmissions,
      avgAge,
      topLocation,
      genderDistribution,
      completionRate: responses.length > 0 ? 95 : 0,
      avgResponseTime: 12,
      totalDistricts: uniqueDistricts
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
          transformedResponses = data.map((item: any, index: number) => {
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
              status: item.status || 'submitted',
              answers: answers
            };
          });
        } else {
          console.warn('API returned non-array data:', data);
        }
        
        console.log('Transformed responses:', transformedResponses);
        setResponses(transformedResponses);
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
        }
      ];
      setResponses(sampleData);
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
        setResponses(prev => prev.filter(r => r.id !== id));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const exportData = (filteredResponses: Response[]) => {
    const headers = ['Name', 'Age', 'Gender', 'District', 'Location', 'Submitted At', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredResponses.map(r => [
        r.name, r.age, r.gender, r.district, r.location, r.submittedAt, r.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `questionnaire_responses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return {
    responses,
    stats,
    loading,
    error,
    loadResponses,
    deleteResponse,
    exportData
  };
};
