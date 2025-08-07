"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styled from 'styled-components';
import { FiArrowLeft, FiDownload, FiUser, FiMapPin, FiCalendar, FiClock } from 'react-icons/fi';
import EnhancedNavbar from '../../../../components/EnhancedNavbar';
import { useAuth } from '../../../../contexts/AuthContext';

const PageContainer = styled.div`
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  padding: 2rem 1rem;
  margin: 0 auto;
  box-sizing: border-box;
`;

const HeaderCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 1rem;
  
  &:hover {
    background: #5856eb;
  }
`;

const ResponseCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 1.5rem;
`;

const ResponseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const UserName = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${props => props.status === 'submitted' ? '#d4edda' : '#fff3cd'};
  color: ${props => props.status === 'submitted' ? '#155724' : '#856404'};
`;

const SectionCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
`;

const QuestionItem = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
`;

const QuestionText = styled.div`
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const AnswerText = styled.div`
  color: #6b7280;
  padding: 0.5rem;
  background: #f3f4f6;
  border-radius: 4px;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.1rem;
  color: #6b7280;
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
  text-align: center;
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background: #059669;
  }
`;

interface ResponseData {
  _id: string;
  responseId: string;
  submittedBy: string;
  answers: any;
  status: string;
  submissionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ViewResponsePage() {
  const router = useRouter();
  const params = useParams();
  const { isLoggedIn, user } = useAuth();
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'admin') {
      router.push('/admin-login');
      return;
    }

    const fetchResponse = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const res = await fetch(`/api/responses/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch response');
        }

        const data = await res.json();
        // Handle the response structure from backend
        if (data.success && data.data) {
          setResponse(data.data);
        } else if (data._id) {
          // Direct response object
          setResponse(data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchResponse();
    }
  }, [params.id, isLoggedIn, user, router]);

  const exportResponse = () => {
    if (!response) return;

    const exportData = {
      responseId: response.responseId,
      submittedBy: response.submittedBy,
      status: response.status,
      submissionDate: response.submissionDate || response.createdAt,
      answers: response.answers
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response_${response.responseId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderAnswers = (answers: any) => {
    if (!answers) return <div>No answers available</div>;

    return Object.entries(answers).map(([sectionKey, sectionData]: [string, any]) => (
      <SectionCard key={sectionKey}>
        <SectionTitle>{sectionKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</SectionTitle>
        {typeof sectionData === 'object' && sectionData !== null ? (
          Object.entries(sectionData).map(([questionKey, answer]: [string, any]) => (
            <QuestionItem key={questionKey}>
              <QuestionText>{questionKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</QuestionText>
              <AnswerText>
                {typeof answer === 'object' ? JSON.stringify(answer, null, 2) : String(answer)}
              </AnswerText>
            </QuestionItem>
          ))
        ) : (
          <AnswerText>{String(sectionData)}</AnswerText>
        )}
      </SectionCard>
    ));
  };

  if (loading) {
    return (
      <PageContainer>
        <EnhancedNavbar />
        <ContentWrapper>
          <LoadingSpinner>Loading response...</LoadingSpinner>
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <EnhancedNavbar />
        <ContentWrapper>
          <ErrorMessage>Error: {error}</ErrorMessage>
          <BackButton onClick={() => router.push('/admin-dashboard')}>
            <FiArrowLeft /> Back to Dashboard
          </BackButton>
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (!response) {
    return (
      <PageContainer>
        <EnhancedNavbar />
        <ContentWrapper>
          <ErrorMessage>Response not found</ErrorMessage>
          <BackButton onClick={() => router.push('/admin-dashboard')}>
            <FiArrowLeft /> Back to Dashboard
          </BackButton>
        </ContentWrapper>
      </PageContainer>
    );
  }

  const userInfo = response.answers?.section1 || {};

  return (
    <PageContainer>
      <EnhancedNavbar />
      <ContentWrapper>
        <HeaderCard>
          <BackButton onClick={() => router.push('/admin-dashboard')}>
            <FiArrowLeft /> Back to Dashboard
          </BackButton>
          
          <ResponseHeader>
            <UserInfo>
              <UserName>{userInfo.respondentName || userInfo.uname || 'Unknown User'}</UserName>
              <InfoItem>
                <FiUser />
                Age: {userInfo.age || 'N/A'} | Gender: {userInfo.gender || 'N/A'}
              </InfoItem>
              <InfoItem>
                <FiMapPin />
                District: {userInfo.district || 'N/A'}
              </InfoItem>
              <InfoItem>
                <FiCalendar />
                Submitted: {response.submissionDate ? 
                  new Date(response.submissionDate).toLocaleDateString() : 
                  new Date(response.createdAt).toLocaleDateString()}
              </InfoItem>
              <InfoItem>
                <FiClock />
                Response ID: {response.responseId}
              </InfoItem>
            </UserInfo>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end' }}>
              <StatusBadge status={response.status}>{response.status}</StatusBadge>
              <ExportButton onClick={exportResponse}>
                <FiDownload /> Export Response
              </ExportButton>
            </div>
          </ResponseHeader>
        </HeaderCard>

        <ResponseCard>
          <h2 style={{ marginBottom: '1.5rem', color: '#1f2937' }}>Response Details</h2>
          {renderAnswers(response.answers)}
        </ResponseCard>
      </ContentWrapper>
    </PageContainer>
  );
}
