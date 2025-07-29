"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext'; // Added for authentication context
import { useTranslation } from '@/contexts/TranslationContext';
import { theme } from '@/styles/theme';
import {
  Button,
  Input,
  Card,
  Heading,
  Text,
  Container,
  FormGroup,
  Label,
  Alert,
  Stack,
  Select
} from '@/components/ui';
import EnhancedNavbar from '@/components/EnhancedNavbar';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import axios from 'axios';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${theme.colors.primary[50]} 0%, ${theme.colors.secondary[50]} 100%);
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
  }
`;

const SignInContainer = styled(Container)`
  max-width: 480px;
`;

const SignInCard = styled(Card)`
  padding: ${theme.spacing['3xl']};
  position: relative;
  overflow: visible;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing['2xl']};
  }

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, ${theme.colors.primary[400]}, ${theme.colors.primary[600]});
    border-radius: ${theme.borderRadius.xl};
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 0.1;
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing['2xl']};
`;

const IconWrapper = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[600]} 100%);
  border-radius: ${theme.borderRadius.xl};
  margin-bottom: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.lg};
`;

const SubTitle = styled(Text)`
  margin-top: ${theme.spacing.sm};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

const InputIcon = styled.div`
  position: absolute;
  left: ${theme.spacing.base};
  color: ${theme.colors.text.tertiary};
  z-index: 2;
  pointer-events: none;
  display: flex;
  align-items: center;
  height: 100%;
`;

const StyledInput = styled(Input)`
  width: 100% !important;
  padding-left: 3rem !important;
  padding-right: 3rem !important;
  
  &:focus + ${InputIcon} {
    color: ${theme.colors.primary[500]};
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: ${theme.spacing.base};
  background: none;
  border: none;
  color: ${theme.colors.text.tertiary};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.2s ease;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;

  &:hover {
    color: ${theme.colors.primary[500]};
    background-color: ${theme.colors.primary[50]};
  }

  .dark &:hover {
    background-color: rgba(59, 130, 246, 0.1);
  }
`;

const ForgotPasswordLink = styled(Link)`
  color: ${theme.colors.primary[600]};
  text-decoration: none;
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  transition: all 0.2s ease;
  display: inline-block;

  &:hover {
    color: ${theme.colors.primary[700]};
    text-decoration: underline;
  }
`;

const SignUpPrompt = styled.div`
  text-align: center;
  margin-top: ${theme.spacing.xl};
  padding-top: ${theme.spacing.xl};
  border-top: 1px solid ${theme.colors.border.light};

  .dark & {
    border-top-color: #334155;
  }
`;

const SignUpLink = styled(Link)`
  color: ${theme.colors.primary[600]};
  text-decoration: none;
  font-weight: ${theme.typography.fontWeight.semibold};
  transition: all 0.2s ease;

  &:hover {
    color: ${theme.colors.primary[700]};
    text-decoration: underline;
  }
`;

const LoadingSpinner = styled(motion.div)`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
`;

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [project, setProject] = useState('');
  // Corrected type for projects:
  const [projects, setProjects] = useState<Array<{id: string, name: string, description: string}>>([]); 
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null); // This 'error' is a general error for the whole form/login attempt
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // Assuming useAuth provides a login function
  const { t } = useTranslation(); // Translation hook
  const router = useRouter();

  // Fetch available projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setProjectsLoading(true);
        // Clear any previous general error before fetching projects
        setError(null); 
        
        console.log('Fetching projects...'); // Debug logging
        const response = await axios.get('/api/projects');
        console.log('Projects response:', response.data); // Debug logging
        
        if (response.data.success && response.data.projects) {
          setProjects(response.data.projects);
          console.log('Projects loaded successfully:', response.data.projects);
        } else {
          // Fallback: provide default projects if API doesn't return expected format
          const fallbackProjects = [
            { id: 'project1', name: 'Project 1', description: 'First project' },
            { id: 'project2', name: 'Project 2', description: 'Second project' }
          ];
          setProjects(fallbackProjects);
          console.log('Using fallback projects:', fallbackProjects);
        }
      } catch (error: unknown) {
        const errorObj = error as { response?: { data?: string }; message?: string };
        console.error('Failed to fetch projects:', error);
        console.error('Error details:', errorObj.response?.data || errorObj.message);
        
        // Provide fallback projects even if API fails
        const fallbackProjects = [
          { id: 'project1', name: 'Project 1', description: 'First project' },
          { id: 'project2', name: 'Project 2', description: 'Second project' }
        ];
        setProjects(fallbackProjects);
        
        // Set a specific error message for project loading failure
        setError('Failed to load projects from server. Using default projects.'); 
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setIsLoading(true);
    
    // Basic client-side validation for required fields
    if (!email || !password || !project) {
        setError('Please fill in all required fields (Email, Password, Project).');
        setIsLoading(false);
        return;
    }

    try {
      const result = await login(email, password, project); // Call the login function from AuthContext
      
      // Redirect based on user role provided by the login result
      if (result && result.role) { // Check if result and role exist
        if (result.role === 'admin') {
          router.push('/admin-dashboard');
        } else {
          router.push('/questionnaire');
        }
      } else {
        // Handle unexpected login result structure
        setError('Login successful, but user role not found for redirection. Please contact support.');
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      // Axios errors usually have a `response.data.message`
      const errorMessage = errorObj.response?.data?.message || 'An unexpected error occurred during sign-in. Please try again.';
      setError(errorMessage);
      console.error('Sign-in failed:', err); // Log full error for debugging
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <PageWrapper>
      <EnhancedNavbar />
      <ContentArea>
        <SignInContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SignInCard>
              <HeaderSection>
                <IconWrapper
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <Sparkles size={28} color="white" />
                </IconWrapper>
                <Heading>{t('Good Morning Friend')}</Heading>
                <SubTitle size="lg" color="secondary">
                  {t('Sign in to your account to continue')}
                </SubTitle>
              </HeaderSection>

              <form onSubmit={handleSubmit}>
                <Stack spacing="lg">
                <FormGroup>
                  <Label htmlFor="email">{t('Email')}</Label>
                  <InputWrapper>
                    <StyledInput
                      type="email"
                      id="email"
                      placeholder={t('Enter your email')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      // `hasError` should ideally be tied to email-specific validation error
                      // For now, it's tied to the general 'error' state
                      hasError={!!error} 
                    />
                    <InputIcon>
                      <Mail size={20} />
                    </InputIcon>
                  </InputWrapper>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="password">{t('Password')}</Label>
                  <InputWrapper>
                    <StyledInput
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      placeholder={t('Enter your password')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      // `hasError` should ideally be tied to password-specific validation error
                      // For now, it's tied to the general 'error' state
                      hasError={!!error}
                    />
                    <InputIcon>
                      <Lock size={20} />
                    </InputIcon>
                    <PasswordToggle
                      type="button"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? t('Hide password') : t('Show password')}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </PasswordToggle>
                  </InputWrapper>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="project">{t('Project')}</Label>
                  <Select
                    id="project"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    required
                    fullWidth
                    // `hasError` should ideally be tied to project-specific validation error
                    // For now, it's tied to the general 'error' state
                    hasError={!!error} 
                    disabled={projectsLoading}
                  >
                    <option value="">
                      {projectsLoading ? t('Loading projects...') : t('Select a project')}
                    </option>
                    {projects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.name}
                      </option>
                    ))}
                  </Select>
                  {projectsLoading && (
                    <Text size="sm" color="secondary" style={{ marginTop: '0.5rem' }}>
                      {t('Fetching available projects from database...')}
                    </Text>
                  )}
                  {/* If there's an error from loading projects or a general error, display it here */}
                  {error && (
                    <Text size="sm" style={{ color: theme.colors.error[500], marginTop: '0.5rem' }}>
                      {error}
                    </Text>
                  )}
                </FormGroup>

                <div style={{ textAlign: 'right' }}>
                  <ForgotPasswordLink href="/forgot-password">
                    {t('Forgot your password?')}
                  </ForgotPasswordLink>
                </div>

                {error && ( // Display the general error for the form submission
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Alert variant="error">
                      {error}
                    </Alert>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  disabled={isLoading || !email || !password || !project}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                >
                  {isLoading ? (
                    <Stack direction="row" spacing="sm" align="center">
                      <LoadingSpinner
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      <span>{t('Signing In...')}</span>
                    </Stack>
                  ) : (
                    <Stack direction="row" spacing="sm" align="center">
                      <span>{t('Sign In')}</span>
                      <ArrowRight size={20} />
                    </Stack>
                  )}
                </Button>
                </Stack>
              </form>

              <SignUpPrompt>
                <Text color="secondary">
                  {t("Don't have an account?")}{' '}
                  <SignUpLink href="/signup">
                    {t('Create one now')}
                  </SignUpLink>
                </Text>
              </SignUpPrompt>
            </SignInCard>
          </motion.div>
        </SignInContainer>
      </ContentArea>
    </PageWrapper>
  );
};

export default SignInPage;