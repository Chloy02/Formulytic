import { useState, useCallback } from 'react';
import ServerLink from '../lib/api/serverURL';

export interface Response {
  _id: string;
  responseId: string;
  status: string;
  submissionDate: string;
  lastSaved: string;
  submittedBy: {
    _id: string;
    username: string;
    email: string;
  } | string;
  answers: {
    section1?: {
      spouseName?: string;
      applicantGender?: string;
      applicantAge?: string;
      spouseAge?: string;
      district?: string;
      residentialAddress?: string;
      [key: string]: any;
    };
    section2?: {
      [key: string]: any;
    };
    section3?: {
      [key: string]: any;
    };
    section4?: {
      [key: string]: any;
    };
    section5?: {
      [key: string]: any;
    };
    section6_Devadasi?: {
      [key: string]: any;
    };
    section6_Widow?: {
      [key: string]: any;
    };
    section6_NonBeneficiary?: {
      [key: string]: any;
    };
    [key: string]: any;
  };
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
  // New analytics for government project
  devdasiWomen: number;
  widows: number;
  beneficiaryTypes: {
    devadasi: number;
    widow: number;
    nonBeneficiary: number;
    other: number;
  };
  schemeParticipation: {
    interCasteMarriage: number;
    socialWelfare: number;
    scheduledCasteWelfare: number;
  };
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
    totalDrafts: 0,
    devdasiWomen: 0,
    widows: 0,
    beneficiaryTypes: {
      devadasi: 0,
      widow: 0,
      nonBeneficiary: 0,
      other: 0
    },
    schemeParticipation: {
      interCasteMarriage: 0,
      socialWelfare: 0,
      scheduledCasteWelfare: 0
    }
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
      new Date(r.submissionDate) >= sevenDaysAgo
    ).length;

    // Extract age from section1.age (not applicantAge)
    const totalAge = completedResponses.reduce((sum, r) => {
      const age = parseInt(r.answers?.section1?.age || '0');
      return sum + age;
    }, 0);
    const avgAge = completedResponses.length > 0 ? Math.round(totalAge / completedResponses.length) : 0;

    // Extract gender from section1.applicantGender
    const genderDistribution = completedResponses.reduce((acc, r) => {
      const gender = (r.answers?.section1?.applicantGender || '').toLowerCase();
      if (gender === 'male') acc.male++;
      else if (gender === 'female') acc.female++;
      else acc.other++;
      return acc;
    }, { male: 0, female: 0, other: 0 });

    // Extract location from section1.district or residentialAddress
    const locationCounts = completedResponses.reduce((acc: Record<string, number>, r) => {
      const location = r.answers?.section1?.district || 
                      r.answers?.section1?.residentialAddress || 
                      'Unknown';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});
    
    const topLocation = Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    const uniqueDistricts = new Set(
      completedResponses.map(r => r.answers?.section1?.district || r.answers?.section1?.residentialAddress || 'Unknown')
    ).size;

    // Calculate new analytics for government project
    
    // Count Devadasi women and widows from section6 data
    let devdasiWomen = 0;
    let widows = 0;
    const beneficiaryTypes = { devadasi: 0, widow: 0, nonBeneficiary: 0, other: 0 };
    
    completedResponses.forEach(r => {
      const answers = r.answers || {};
      
      // Check for Devadasi women in section6_Devadasi
      if (answers.section6_Devadasi && Object.keys(answers.section6_Devadasi).length > 0) {
        devdasiWomen++;
        beneficiaryTypes.devadasi++;
      }
      // Check for widows in section6_Widow
      else if (answers.section6_Widow && Object.keys(answers.section6_Widow).length > 0) {
        widows++;
        beneficiaryTypes.widow++;
      }
      // Check for non-beneficiaries in section6_NonBeneficiary
      else if (answers.section6_NonBeneficiary && Object.keys(answers.section6_NonBeneficiary).length > 0) {
        beneficiaryTypes.nonBeneficiary++;
      }
      else {
        beneficiaryTypes.other++;
      }
    });

    // Calculate scheme participation from section2 or other relevant sections
    const schemeParticipation = { interCasteMarriage: 0, socialWelfare: 0, scheduledCasteWelfare: 0 };
    
    completedResponses.forEach(r => {
      const answers = r.answers || {};
      const section2 = answers.section2 || {};
      const section3 = answers.section3 || {};
      
      // Check for inter-caste marriage incentives
      if (section2.interCasteMarriageIncentive === 'yes' || 
          section2.receivedIncentives?.includes('inter-caste') ||
          section3.marriageType === 'inter-caste') {
        schemeParticipation.interCasteMarriage++;
      }
      
      // Check for social welfare schemes
      if (section2.socialWelfareSchemes || section2.receivedSchemes?.includes('social-welfare')) {
        schemeParticipation.socialWelfare++;
      }
      
      // Check for scheduled caste welfare schemes
      if (section2.scheduledCasteWelfare || section2.receivedSchemes?.includes('scheduled-caste')) {
        schemeParticipation.scheduledCasteWelfare++;
      }
    });

    setStats({
      totalResponses: completedResponses.length,
      recentSubmissions,
      avgAge,
      topLocation,
      genderDistribution,
      completionRate: allResponses.length > 0 ? Math.round((completedResponses.length / allResponses.length) * 100) : 0,
      avgResponseTime: 12,
      totalDistricts: uniqueDistricts,
      totalDrafts: draftResponses.length,
      devdasiWomen,
      widows,
      beneficiaryTypes,
      schemeParticipation
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
      
      console.log('Attempting to fetch analytics from:', `${ServerLink}/responses/admin/analytics`);
      
      // Call the admin analytics endpoint to get comprehensive data
      const analyticsResponse = await fetch(`${ServerLink}/responses/admin/analytics`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Analytics response status:', analyticsResponse.status);

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        console.log('Raw Analytics API Response:', analyticsData);
        
        // Extract submitted responses for table display - double filter for safety
        const submittedResponses = (analyticsData.submittedResponses || [])
          .filter((item: any) => item.status === 'submitted'); // Extra safety filter
        
        // Transform submitted responses for display
        const transformedResponses: Response[] = submittedResponses.map((item: any, index: number) => {
          console.log(`Processing submitted response ${index}:`, item);
          
          const answers = item.answers || {};
          
          return {
            _id: item._id || `temp-${index}`,
            responseId: item.responseId || '',
            status: 'submitted', // Force status to submitted
            submissionDate: item.submissionDate || new Date().toISOString(),
            lastSaved: item.lastSaved || new Date().toISOString(),
            submittedBy: item.submittedBy || 'Unknown User',
            answers: answers
          };
        });
        
        console.log('Transformed submitted responses:', transformedResponses);
        
        // Store all responses for analytics (including drafts)
        setAllResponses(analyticsData.allResponses || []);
        
        // Store only submitted responses for table display
        setResponses(transformedResponses);
        
        // Calculate stats using ALL responses for comprehensive analytics
        calculateStats(analyticsData.allResponses || []);
        console.log('✅ Admin Dashboard: Stats calculated with', analyticsData.allResponses?.length || 0, 'total responses');
        console.log('📊 Analytics Summary:', {
          totalResponses: analyticsData.totalCount,
          submitted: analyticsData.submittedCount, 
          drafts: analyticsData.draftCount,
          transformedForTable: transformedResponses.length
        });
        
      } else {
        const errorText = await analyticsResponse.text();
        console.error('Analytics API Error Response:', errorText);
        throw new Error(`Analytics API Error: ${analyticsResponse.status} ${analyticsResponse.statusText} - ${errorText}`);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics';
      setError(errorMessage);
      
      // Fallback to empty data
      console.log('Using fallback empty data due to error');
      const sampleData: Response[] = [];
      
      setAllResponses(sampleData);
      setResponses(sampleData);
      calculateStats(sampleData);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  const viewResponse = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${ServerLink}/responses/${id}`, {
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
          formatField(r.answers?.section1?.applicantName || 'N/A'),
          formatField(r.answers?.section1?.age || 'N/A'),
          formatField(r.answers?.section1?.applicantGender || 'N/A'),
          formatField(r.answers?.section1?.residentialAddress || 'N/A'),
          formatField(r.answers?.section1?.residentialAddress || 'N/A'),
          formatField(new Date(r.submissionDate).toLocaleDateString()),
          formatField(r.status),
          formatField(section1.applicantEducation),
          formatField(section1.applicantCasteCategory),
          formatField(section1.applicantOccupationBefore),
          formatField(section2.applicantOccupationAfter),
          formatField(section1.familyAnnualIncome),
          formatField(section2.currentFamilyIncome),
          formatField(section1.applicantEmploymentBefore),
          formatField(section2.applicantOccupationAfter),
          formatField(section1.schemes),
          formatField(section1.grantDate),
          formatField(section1.utilization),
          formatField(section1.spouseEmploymentBefore),
          formatField(section2.socioEconomicStatusBefore),
          formatField(section2.socioEconomicStatusAfter),
          formatField(section3.financialSecurityRating),
          formatField(section3.socialLifeAfterMarriage),
          formatField(section3.decisionMakingInfluence),
          formatField(section3.marriageOpposition),
          formatField(section3.relocationAfterMarriage),
          formatField(section5.aadhaarCardProvided),
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
    viewResponse,
    exportData
  };
};
