"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/TranslationContext';
import { theme } from '@/styles/theme';
import { buildApiUrl } from '@/config/api';
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
  Stack
} from '@/components/ui';
import EnhancedNavbar from '@/components/EnhancedNavbar';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, User } from 'lucide-react';
import axios from 'axios';

// Styled Components for the Sign-Up Page

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
  padding: ${theme.spacing['6xl']} ${theme.spacing.base} ${theme.spacing['4xl']};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing['4xl']} ${theme.spacing.base} ${theme.spacing['2xl']};
  }
`;

const SignUpContainer = styled(Container)`
  max-width: 480px;
`;

const SignUpCard = styled(Card)`
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

const SignInPrompt = styled.div`
  text-align: center;
  margin-top: ${theme.spacing.xl};
  padding-top: ${theme.spacing.xl};
  border-top: 1px solid ${theme.colors.border.light};

  .dark & {
    border-top-color: #334155;
  }
`;

const SignInLink = styled(Link)`
  color: ${theme.colors.primary[600]};
  text-decoration: none;
  font-weight: ${theme.typography.fontWeight.semibold};
  transition: all 0.2s ease;

  &:hover {
    color: ${theme.colors.primary[700]};
    text-decoration: underline;
  }

  .dark & {
    color: #60a5fa;

    &:hover {
      color: #93c5fd;
    }
  }
`;

const LoadingSpinner = styled(motion.div)`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
`;

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Specific error states for each field
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset all specific and general errors
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    setGeneralError(null);
    setSuccess(null);
    setIsLoading(true);

    // Client-side validation
    let isValid = true;
    
    // Name validation
    if (!name || name.trim().length === 0) {
      setNameError('Name is required.');
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters.');
      isValid = false;
    }

    // Email validation - specifically check for Gmail
    if (!email) {
      setEmailError('Email is required.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format.');
      isValid = false;
    } else if (!email.toLowerCase().endsWith('@gmail.com')) {
      setEmailError('Please use a Gmail address (@gmail.com).');
      isValid = false;
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    }

    // Confirm password validation
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    }

    if (!isValid) {
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(buildApiUrl('/auth/register'), {
        username: name.trim(),
        email,
        password,
      });
      setSuccess('Account created successfully! Redirecting to sign in...');
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    } catch (error: any) {
      // Prioritize API-specific error messages if available
      const apiErrorMessage = error.response?.data?.message;
      const apiErrors = error.response?.data?.errors;

      if (apiErrors) {
        // Handle field-specific errors from the API
        if (apiErrors.name) setNameError(apiErrors.name);
        if (apiErrors.email) setEmailError(apiErrors.email);
        if (apiErrors.password) setPasswordError(apiErrors.password);
        if (apiErrors.confirmPassword) setConfirmPasswordError(apiErrors.confirmPassword);
        
        // If there's a general API message but no specific field errors, use it as a general error
        if (apiErrorMessage && !apiErrors.name && !apiErrors.email && !apiErrors.password && !apiErrors.confirmPassword) {
          setGeneralError(apiErrorMessage);
        } else if (!apiErrorMessage) {
          setGeneralError('Signup failed due to validation issues.');
        }

      } else {
        // Fallback for general server errors
        setGeneralError(apiErrorMessage || 'Signup failed. Please try again. Network or server issue.');
      }
      console.error('Signup failed:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <PageWrapper>
      <EnhancedNavbar />
      <ContentArea>
        <SignUpContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SignUpCard>
              <HeaderSection>
                <IconWrapper
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <Sparkles size={28} color="white" />
                </IconWrapper>
                <Heading>{t('Sign up')}</Heading>
                <SubTitle size="lg" color="secondary">
                  {t('Already have an account?')}{' '}
                  <SignInLink href="/signin">{t('Sign In')}</SignInLink>
                </SubTitle>
              </HeaderSection>

              <form onSubmit={handleSubmit}>
                <Stack spacing="lg">
                <FormGroup>
                  <Label htmlFor="name">{t('Full Name')}</Label>
                  <InputWrapper>
                    <StyledInput
                      type="text"
                      id="name"
                      placeholder={t('Your full name')}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      hasError={!!nameError}
                    />
                    <InputIcon>
                      <User size={20} />
                    </InputIcon>
                  </InputWrapper>
                  {nameError && (
                    <Text
                      size="sm"
                      style={{ color: theme.colors.error[500], marginTop: '0.25rem' }}
                    >
                      {nameError}
                    </Text>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="email">{t('Email')}</Label>
                  <InputWrapper>
                    <StyledInput
                      type="email"
                      id="email"
                      placeholder={t('you@gmail.com')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      hasError={!!emailError} // Apply error style only if emailError exists
                    />
                    <InputIcon>
                      <Mail size={20} />
                    </InputIcon>
                  </InputWrapper>
                  {emailError && (
                    <Text
                      size="sm"
                      // Use inline style for color since 'error' is not a defined prop value
                      style={{ color: theme.colors.error[500], marginTop: '0.25rem' }}
                    >
                      {emailError}
                    </Text>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="password">{t('Password')}</Label>
                  <InputWrapper>
                    <StyledInput
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      placeholder={t('Your password (6+ characters)')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      hasError={!!passwordError} // Apply error style only if passwordError exists
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
                  {passwordError && (
                    <Text
                      size="sm"
                      // Use inline style for color since 'error' is not a defined prop value
                      style={{ color: theme.colors.error[500], marginTop: '0.25rem' }}
                    >
                      {passwordError}
                    </Text>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="confirmPassword">{t('Confirm Password')}</Label>
                  <InputWrapper>
                    <StyledInput
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      placeholder={t('Confirm your password')}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      hasError={!!confirmPasswordError}
                    />
                    <InputIcon>
                      <Lock size={20} />
                    </InputIcon>
                    <PasswordToggle
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      aria-label={showConfirmPassword ? t('Hide confirm password') : t('Show confirm password')}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </PasswordToggle>
                  </InputWrapper>
                  {confirmPasswordError && (
                    <Text
                      size="sm"
                      style={{ color: theme.colors.error[500], marginTop: '0.25rem' }}
                    >
                      {confirmPasswordError}
                    </Text>
                  )}
                </FormGroup>

                {/* Display general errors not tied to a specific field */}
                {generalError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Alert variant="error">
                      {generalError}
                    </Alert>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Alert variant="success">
                      {success}
                    </Alert>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  disabled={isLoading || !name || !email || !password || !confirmPassword}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                >
                  {isLoading ? (
                    <Stack direction="row" spacing="sm" align="center">
                      <LoadingSpinner
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      <span>{t('Creating Account...')}</span>
                    </Stack>
                  ) : (
                    <Stack direction="row" spacing="sm" align="center">
                      <span>{t('Sign up')}</span>
                      <ArrowRight size={20} />
                    </Stack>
                  )}
                </Button>
                </Stack>
              </form>

              <SignInPrompt>
                <Text color="secondary">
                  {t('Already have an account?')}{' '}
                  <SignInLink href="/signin">
                    {t('Sign In')}
                  </SignInLink>
                </Text>
              </SignInPrompt>
            </SignUpCard>
          </motion.div>
        </SignUpContainer>
      </ContentArea>
    </PageWrapper>
  );
}