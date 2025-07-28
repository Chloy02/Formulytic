"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, Lock, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { theme } from '@/styles/theme';
import { Button, Input, Card, Heading, Text, Container, Alert, Stack } from '@/components/ui';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${theme.colors.primary[50]} 0%, ${theme.colors.secondary[50]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.base};
`;

const AdminLoginCard = styled(Card)`
  max-width: 400px;
  width: 100%;
  padding: ${theme.spacing.xl};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${theme.colors.primary[500]}, ${theme.colors.secondary[500]});
  }
`;

const AdminBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  background: linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.primary[600]});
  color: white;
  padding: ${theme.spacing.sm} ${theme.spacing.base};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  margin-bottom: ${theme.spacing.lg};
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: ${theme.spacing.base};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.2s ease;

  &:hover {
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.secondary[100]};
  }
`;

const PasswordInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const FormFooter = styled.div`
  text-align: center;
  margin-top: ${theme.spacing.lg};
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.border.light};
`;

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { adminLogin } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await adminLogin(formData.username, formData.password);
      
      if (result.success && result.user?.role === 'admin') {
        router.push('/admin-dashboard');
      } else if (result.success && result.user?.role !== 'admin') {
        setError('Access denied. Admin privileges required.');
        // Don't redirect regular users, keep them on admin login page
      } else {
        setError(result.error || 'Invalid admin credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <PageContainer>
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AdminLoginCard>
            <AdminBadge>
              <Shield size={16} />
              Administrator Access
            </AdminBadge>

            <Stack spacing="lg" align="center">
              <Stack spacing="sm" align="center">
                <Heading level={2} color="primary">
                  Admin Login
                </Heading>
                <Text color="secondary" size="sm" align="center">
                  Secure access to administrator dashboard
                </Text>
              </Stack>

              {error && (
                <Alert variant="error" style={{ width: '100%' }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <Stack spacing="lg">
                  <Stack spacing="base">
                    <Input
                      type="text"
                      name="username"
                      placeholder="Admin Username or Email"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      fullWidth
                      icon={<User size={20} />}
                    />

                    <PasswordInputWrapper>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Admin Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        fullWidth
                        icon={<Lock size={20} />}
                        style={{ paddingRight: '48px' }}
                      />
                      <PasswordToggle
                        type="button"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </PasswordToggle>
                    </PasswordInputWrapper>
                  </Stack>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={isLoading}
                  >
                    {isLoading ? 'Verifying...' : 'Access Admin Dashboard'}
                  </Button>
                </Stack>
              </form>
            </Stack>

            <FormFooter>
              <Text size="sm" color="secondary">
                Need admin access? Contact your system administrator.
              </Text>
            </FormFooter>
          </AdminLoginCard>
        </motion.div>
      </Container>
    </PageContainer>
  );
};

export default AdminLogin;
