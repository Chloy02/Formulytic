'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Navbar2 from '../../components/Navbar2';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../../components/ui/dropdown-menu';
import { Search, Download, Eye, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, TrendingUp, Users, FileText, Clock, ChevronDown, Filter } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

// Types
interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  className?: string;
}

interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  label: string;
  value: string | null;
  options: FilterOption[];
  onChange: (value: string) => void;
  onClear: () => void;
  icon?: LucideIcon;
}

interface ActiveFilterChipProps {
  label: string;
  value: string;
  onRemove: () => void;
}

interface Response {
  id: number;
  user: string;
  email: string;
  submitted: string;
  status: 'completed' | 'pending';
  district: string;
}

// Stripe-inspired metric card component
const MetricCard = ({ title, value, change, trend, icon: Icon, className = "" }: MetricCardProps) => (
  <Card className={`border-0 shadow-sm bg-white ${className}`}>
    <CardContent className="p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline space-x-3">
            <p className="text-3xl font-semibold text-gray-900">{value}</p>
            {change && (
              <div className={`flex items-center space-x-1 ${
                trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-gray-500'
              }`}>
                <span className="text-sm font-medium">{change}</span>
              </div>
            )}
          </div>
        </div>
        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
          <Icon className="h-5 w-5 text-gray-600" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Enhanced filter dropdown component
const FilterDropdown = ({ label, value, options, onChange, onClear, icon: Icon }: FilterDropdownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        className={`h-9 px-3 gap-2 border hover:border-solid transition-all bg-white ${
          value 
            ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100' 
            : 'text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        {Icon && <Icon className="h-4 w-4" />}
        <span>{value ? `${label}: ${value}` : label}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" className="w-48 bg-white border border-gray-200 shadow-lg">
      {options.map((option: FilterOption) => (
        <DropdownMenuItem
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`cursor-pointer ${value === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
        >
          {option.label}
        </DropdownMenuItem>
      ))}
      {value && (
        <>
          <DropdownMenuSeparator className="bg-gray-200" />
          <DropdownMenuItem onClick={onClear} className="text-gray-500 hover:bg-gray-50 cursor-pointer">
            Clear filter
          </DropdownMenuItem>
        </>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);

// Active filter chip component (for showing applied filters)
const ActiveFilterChip = ({ label, value, onRemove }: ActiveFilterChipProps) => (
  <Badge className="px-3 py-1 bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200">
    {label}: {value}
    <button onClick={onRemove} className="ml-2 hover:text-blue-600 font-bold text-blue-600">
      ×
    </button>
  </Badge>
);

// Main dashboard component
export default function StripeDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  // Mock data - replace with actual data hooks
  const mockResponses: Response[] = [
    { id: 1, user: 'John Doe', email: 'john@example.com', submitted: '2024-01-15', status: 'completed', district: 'Bangalore Urban' },
    { id: 2, user: 'Jane Smith', email: 'jane@example.com', submitted: '2024-01-14', status: 'pending', district: 'Mysore' },
    { id: 3, user: 'Bob Johnson', email: 'bob@example.com', submitted: '2024-01-13', status: 'completed', district: 'Mangalore' },
    { id: 4, user: 'Alice Wilson', email: 'alice@example.com', submitted: '2024-01-12', status: 'completed', district: 'Hubli-Dharwad' },
    { id: 5, user: 'Charlie Brown', email: 'charlie@example.com', submitted: '2024-01-11', status: 'pending', district: 'Belgaum' },
  ];

  const [allResponses] = useState(mockResponses);
  const [filteredData, setFilteredData] = useState(mockResponses);
  
  // Filter states
  const [activeFilters, setActiveFilters] = useState({
    district: null as string | null,
    dateRange: null as string | null
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/signin');
    }
  }, [user, router]);

  // Real-time filtering effect
  useEffect(() => {
    let filtered = allResponses;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(response => 
        response.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.district.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply district filter
    if (activeFilters.district) {
      filtered = filtered.filter(response => response.district === activeFilters.district);
    }

    // Apply date range filter (mock implementation)
    if (activeFilters.dateRange) {
      // In real implementation, you'd parse dates and filter by range
      // For now, just showing the concept
      console.log('Filtering by date range:', activeFilters.dateRange);
    }

    setFilteredData(filtered);
  }, [searchTerm, activeFilters, allResponses]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  // Stripe-style metrics
  const metrics = [
    {
      title: 'Total Responses',
      value: '2,847',
      change: '+12.5%',
      trend: 'up' as const,
      icon: FileText
    },
    {
      title: 'Active Users',
      value: '1,324',
      change: '+8.2%',
      trend: 'up' as const,
      icon: Users
    },
    {
      title: 'Completion Rate',
      value: '87.3%',
      change: '+2.1%',
      trend: 'up' as const,
      icon: TrendingUp
    },
    {
      title: 'Avg. Time',
      value: '4.2 min',
      change: '-0.3 min',
      trend: 'down' as const,
      icon: Clock
    }
  ];

  const handleFilterChange = (filterType: keyof typeof activeFilters, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilter = (filterType: keyof typeof activeFilters) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: null
    }));
  };

  // Filter options
  const districtOptions: FilterOption[] = [
    { label: 'Bangalore Urban', value: 'Bangalore Urban' },
    { label: 'Mysore', value: 'Mysore' },
    { label: 'Mangalore', value: 'Mangalore' },
    { label: 'Hubli-Dharwad', value: 'Hubli-Dharwad' },
    { label: 'Belgaum', value: 'Belgaum' }
  ];

  const dateRangeOptions: FilterOption[] = [
    { label: 'Last 7 days', value: 'last-7-days' },
    { label: 'Last 30 days', value: 'last-30-days' },
    { label: 'Last 3 months', value: 'last-3-months' },
    { label: 'Last 6 months', value: 'last-6-months' },
    { label: 'This year', value: 'this-year' }
  ];

  const clearAllFilters = () => {
    setActiveFilters({ district: null, dateRange: null });
  };

  const hasActiveFilters = Object.values(activeFilters).some(Boolean);

  const exportData = () => {
    // Convert data to CSV format
    const csvHeaders = ['ID', 'User', 'Email', 'District', 'Submitted', 'Status'];
    const csvData = filteredData.map(response => [
      response.id,
      response.user,
      response.email,
      response.district,
      response.submitted,
      response.status
    ]);
    
    // Create CSV content
    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `formulytic-responses-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ Exported', filteredData.length, 'responses to CSV');
  };

  const handleViewResponse = (responseId: number) => {
    // Find the response data
    const response = filteredData.find(r => r.id === responseId);
    if (response) {
      // For now, show an alert with response details
      // In a real app, you'd open a modal or navigate to a detail page
      alert(`Response Details:\n\nUser: ${response.user}\nEmail: ${response.email}\nDistrict: ${response.district}\nSubmitted: ${response.submitted}\nStatus: ${response.status}`);
      
      // Alternative: Navigate to detail page
      // router.push(`/admin-dashboard/responses/${responseId}`);
      
      // Alternative: Set state to show modal
      // setSelectedResponse(response);
      // setShowDetailModal(true);
    }
  };

  const handleDeleteResponse = async (responseId: number) => {
    const response = filteredData.find(r => r.id === responseId);
    if (!response) return;
    
    if (window.confirm(`Are you sure you want to delete the response from ${response.user}? This action cannot be undone.`)) {
      setDeletingId(responseId);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Remove from filtered data (in real app, make API call)
        setFilteredData((prev: Response[]) => prev.filter((response: Response) => response.id !== responseId));
        
        // Show success feedback
        console.log('✅ Successfully deleted response:', responseId);
        
        // In a real app, you would:
        // await deleteResponse(responseId);
        // toast.success('Response deleted successfully');
      } catch (error) {
        console.error('❌ Failed to delete response:', error);
        // toast.error('Failed to delete response');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const totalPages = Math.ceil(filteredData.length / pageSize);

  return (
    <>
      <Navbar2 />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Overview of questionnaire responses and user engagement
                </p>
              </div>
              <Button onClick={exportData} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>        {/* Filters and Search */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Responses</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or district..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 placeholder:text-gray-500"
                />
              </div>
            </div>
            
            {/* Filter Controls Row */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
                <FilterDropdown
                  label="District"
                  value={activeFilters.district}
                  options={districtOptions}
                  onChange={(value) => handleFilterChange('district', value)}
                  onClear={() => clearFilter('district')}
                />
                <FilterDropdown
                  label="Date Range"
                  value={activeFilters.dateRange}
                  options={dateRangeOptions}
                  onChange={(value) => handleFilterChange('dateRange', value)}
                  onClear={() => clearFilter('dateRange')}
                />
              </div>
              
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-gray-200 hover:border-gray-300 transition-colors shadow-sm"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear all filters
                </Button>
              )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap pt-3">
                <span className="text-sm text-gray-600">Active filters:</span>
                {activeFilters.district && (
                  <ActiveFilterChip
                    label="District"
                    value={activeFilters.district}
                    onRemove={() => clearFilter('district')}
                  />
                )}
                {activeFilters.dateRange && (
                  <ActiveFilterChip
                    label="Date Range"
                    value={dateRangeOptions.find(opt => opt.value === activeFilters.dateRange)?.label || activeFilters.dateRange}
                    onRemove={() => clearFilter('dateRange')}
                  />
                )}
              </div>
            )}

            {/* Results Count */}
            <div className="pt-3">
              <p className="text-sm text-gray-600">
                Showing {filteredData.length} of {allResponses.length} responses
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow className="border-t border-gray-200">
                  <TableHead className="font-medium text-gray-600 w-2/5">User</TableHead>
                  <TableHead className="font-medium text-gray-600 w-1/4">District</TableHead>
                  <TableHead className="font-medium text-gray-600 w-1/5">Submitted</TableHead>
                  <TableHead className="font-medium text-gray-600 w-1/6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((response) => (
                  <TableRow key={response.id} className="hover:bg-gray-50 border-gray-200">
                    <TableCell className="w-2/5">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{response.user}</p>
                        <p className="text-sm text-gray-500 truncate">{response.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 w-1/4">
                      <span className="truncate block">{response.district}</span>
                    </TableCell>
                    <TableCell className="text-gray-600 w-1/5">
                      <span className="truncate block">{response.submitted}</span>
                    </TableCell>
                    <TableCell className="w-1/6">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                          title="View response"
                          onClick={() => handleViewResponse(response.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                          title="Delete response"
                          onClick={() => handleDeleteResponse(response.id)}
                          disabled={deletingId === response.id}
                        >
                          {deletingId === response.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} results
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="h-8 w-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
