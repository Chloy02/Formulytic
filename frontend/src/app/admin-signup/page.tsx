"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar2 from '../../components/Navbar2';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const PageWrapper = styled.div`
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f0f4f8;
  color: #333;
  width: 100%;
  overflow-x: hidden;
`;

const ContentArea = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
`;

const SignupCard = styled.div`
  background-color: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 25px;
  }
`;

const CardHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const CardTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 10px;

  @media (max-width: 600px) {
    font-size: 26px;
  }
`;

const AdminBadge = styled.div`
  background-color: #e53e3e;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 15px;
  display: inline-block;
`;

const SignInLinkText = styled.p`
  font-size: 16px;
  color: #555;
  margin: 0;

  a {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  color: #333;
  box-sizing: border-box;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    outline: none;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #e53e3e;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c53030;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #e53e3e;
  background-color: #fff5f5;
  border: 1px solid #e53e3e;
  padding: 10px;
  border-radius: 5px;
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
`;

const SuccessMessage = styled.p`
  color: #38a169;
  background-color: #f0fff4;
  border: 1px solid #38a169;
  padding: 10px;
  border-radius: 5px;
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
`;

export default function AdminSignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
        role: 'admin'
      });
      
      setSuccess('Admin account created successfully! You can now sign in.');
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <PageWrapper>
      <Navbar2 />
      <ContentArea>
        <SignupCard>
          <CardHeader>
            <AdminBadge>ADMIN REGISTRATION</AdminBadge>
            <CardTitle>Create Admin Account</CardTitle>
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </FormGroup>

            <SubmitButton type="submit">Create Admin Account</SubmitButton>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}
          </form>
        </SignupCard>
      </ContentArea>
    </PageWrapper>
  );
}
