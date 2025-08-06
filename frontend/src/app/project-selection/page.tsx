"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/TranslationContext';
import { theme } from '@/styles/theme';
import {
  Button,
  Card,
  Heading,
  Text,
  Container,
  Stack
} from '@/components/ui';
import EnhancedNavbar from '@/components/EnhancedNavbar';
import { ArrowRight, FileText, Users, BarChart3 } from 'lucide-react';
import axios from 'axios';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #eff6ff 0%, #f1f5f9 100%);
  display: flex;
  flex-direction: column;

  .dark & {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  }
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing['4xl']} ${theme.spacing.base};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing['2xl']} ${theme.spacing.base};
    align-items: flex-start;
    padding-top: ${theme.spacing['3xl']};
  }
`;

const SelectionContainer = styled.div`
  max-width: 1200px;
  width: 100%;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing['4xl']};
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${theme.spacing['2xl']};
  margin-bottom: ${theme.spacing['3xl']};

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.xl};
  }
`;

const ProjectCard = styled(motion.div)`
  background: white;
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['2xl']};
  border: 2px solid ${theme.colors.gray[200]};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${theme.colors.primary[500]};
    box-shadow: ${theme.shadows.lg};
    transform: translateY(-4px);
  }

  .dark & {
    background: ${theme.colors.gray[800]};
    border-color: ${theme.colors.gray[700]};
  }
`;

const ProjectIcon = styled.div<{ color: string }>`
  width: 64px;
  height: 64px;
  background: ${props => props.color};
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing.lg};
  color: white;
  font-size: 1.5rem;
`;

const ProjectTitle = styled(Heading)`
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing.base};
  font-size: 1.5rem;

  .dark & {
    color: ${theme.colors.gray[100]};
  }
`;

const ProjectDescription = styled(Text)`
  color: ${theme.colors.gray[600]};
  margin-bottom: ${theme.spacing.lg};
  line-height: 1.6;

  .dark & {
    color: ${theme.colors.gray[300]};
  }
`;

const ProjectMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.base};
  font-size: 0.875rem;
  color: ${theme.colors.gray[500]};
  margin-bottom: ${theme.spacing.lg};

  .dark & {
    color: ${theme.colors.gray[400]};
  }
`;

const SelectButton = styled(Button)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing['4xl']};
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #dc2626;
  padding: ${theme.spacing.xl};
  background: #fef2f2;
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.xl};
`;

interface Project {
  id: string;
  name: string;
  description: string;
  category?: string;
  estimatedTime?: string;
  participants?: number;
}

export default function ProjectSelectionPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching projects...');
      const response = await axios.get('/api/projects');
      console.log('Projects response:', response.data);
      
      if (response.data.success && response.data.projects) {
        setProjects(response.data.projects);
      } else {
        // Fallback projects if API doesn't return expected format
        const fallbackProjects: Project[] = [
          {
            id: 'scsp-tsp-evaluation',
            name: 'SCSP/TSP Impact Evaluation',
            description: 'Comprehensive evaluation of Scheduled Caste Sub Plan and Tribal Sub Plan programs to assess their effectiveness and impact on beneficiary communities.',
            category: 'Government Program Evaluation',
            estimatedTime: '8-12 minutes',
            participants: 1500
          },
          {
            id: 'rural-development-survey',
            name: 'Rural Development Survey',
            description: 'Assessment of rural development initiatives and their impact on local communities, infrastructure, and economic growth.',
            category: 'Development Research',
            estimatedTime: '10-15 minutes',
            participants: 800
          },
          {
            id: 'education-quality-assessment',
            name: 'Education Quality Assessment',
            description: 'Evaluation of educational programs and quality metrics in various educational institutions across Karnataka.',
            category: 'Education Research',
            estimatedTime: '12-18 minutes',
            participants: 600
          }
        ];
        setProjects(fallbackProjects);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
      
      // Fallback projects in case of error
      const fallbackProjects: Project[] = [
        {
          id: 'scsp-tsp-evaluation',
          name: 'SCSP/TSP Impact Evaluation',
          description: 'Comprehensive evaluation of Scheduled Caste Sub Plan and Tribal Sub Plan programs to assess their effectiveness and impact on beneficiary communities.',
          category: 'Government Program Evaluation',
          estimatedTime: '8-12 minutes',
          participants: 1500
        }
      ];
      setProjects(fallbackProjects);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (project: Project) => {
    // Store selected project in localStorage
    localStorage.setItem('selectedProject', JSON.stringify(project));
    
    // Navigate to the main landing page
    router.push('/');
  };

  const getProjectIcon = (index: number) => {
    const icons = [FileText, BarChart3, Users];
    const Icon = icons[index % icons.length];
    return <Icon size={24} />;
  };

  const getProjectColor = (index: number) => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <PageWrapper>
        <EnhancedNavbar />
        <ContentArea>
          <LoadingSpinner>
            <div>Loading projects...</div>
          </LoadingSpinner>
        </ContentArea>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <EnhancedNavbar />
      <ContentArea>
        <SelectionContainer>
          <HeaderSection>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {t("Select a Project")}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t("Choose from our available research projects to participate in. Your contribution helps improve important social programs.")}
              </p>
            </motion.div>
          </HeaderSection>

          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}

          <ProjectGrid>
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => handleProjectSelect(project)}
              >
                <ProjectIcon color={getProjectColor(index)}>
                  {getProjectIcon(index)}
                </ProjectIcon>
                
                <ProjectTitle>
                  {project.name}
                </ProjectTitle>
                
                <ProjectDescription>
                  {project.description}
                </ProjectDescription>
                
                <ProjectMeta>
                  <span>📋 {project.category || 'Research'}</span>
                  <span>⏱️ {project.estimatedTime || '8-12 min'}</span>
                  <span>👥 {project.participants || 0} participants</span>
                </ProjectMeta>
                
                <SelectButton variant="primary">
                  {t("Select This Project")}
                  <ArrowRight size={18} />
                </SelectButton>
              </ProjectCard>
            ))}
          </ProjectGrid>
        </SelectionContainer>
      </ContentArea>
    </PageWrapper>
  );
}
