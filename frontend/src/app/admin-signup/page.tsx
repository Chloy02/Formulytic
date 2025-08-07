"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import EnhancedNavbar from '../../components/EnhancedNavbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useTranslation } from '@/contexts/TranslationContext';
import { 
  PageContainer, 
  GlassCard, 
  Title, 
  FormGroup, 
  Label, 
  Input, 
  Button,
  StatusMessage 
} from '../../styles/components';
import { theme } from '../../styles/theme';

const ContentArea = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.lg};
  box-sizing: border-box;
`;

const AdminBadge = styled.div`
  background: ${theme.colors.secondary.gradient};
  color: white;
  padding: ${theme.spacing.xs} ${theme.spacing.base};
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: ${theme.spacing.base};
  display: inline-block;
`;

const SignInLinkText = styled.p`
  font-size: 1rem;
  color: ${theme.colors.text.secondary};
  margin: 0;

  a {
    color: ${theme.colors.primary[500]};
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const CardHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
`;

export default function AdminSignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/register', {  
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'admin'
      });
      
      setSuccess('Admin account created successfully! You can now sign in.');
      setTimeout(() => router.push('/admin-login'), 2000);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || 'Registration failed'
        : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer style={{ backgroundColor: '#f0f4f8' }}>
      <EnhancedNavbar />
      <ContentArea>
        <GlassCard style={{ maxWidth: '450px', width: '100%' }}>
          <CardHeader>
            <AdminBadge>ADMIN REGISTRATION</AdminBadge>
            <Title size="lg">Create Admin Account</Title>
            <SignInLinkText>
              Already have an account? <Link href="/signin">Sign in</Link>
            </SignInLinkText>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                id="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange('username')}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange('email')}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange('password')}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                required
              />
            </FormGroup>

            <Button 
              type="submit" 
              variant="danger" 
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Creating Account...' : 'Create Admin Account'}
            </Button>

            {error && <StatusMessage type="error">{error}</StatusMessage>}
            {success && <StatusMessage type="success">{success}</StatusMessage>}
          </form>
        </GlassCard>
      </ContentArea>
    </PageContainer>
  );
}
