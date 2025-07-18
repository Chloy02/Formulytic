import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from './components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

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

const SignInCard = styled.div`
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

const SignUpLinkText = styled.p`
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

// CORRECTED: ForgotPasswordLink styled component
const ForgotPasswordLink = styled(Link)`
  display: block;
  font-size: 14px;
  color: #007bff;
  text-decoration: none;
  text-align: right;
  margin-top: 5px; /* CHANGED: Added a small positive margin-top */
  margin-bottom: 20px;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled.button`
// ... existing styles ...
`;

const ErrorMessage = styled.p`
  color: #e53e3e; /* A reddish color for errors */
  background-color: #fff5f5; /* A light red background */
  border: 1px solid #e53e3e;
  padding: 10px;
  border-radius: 5px;
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
`;

const SignInPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // State to hold error messages
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error on new submission
    try {
      await login(username, password);
      navigate('/questionnaire');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      console.error('Login failed:', errorMessage);
    }
  };

  return (
    <PageWrapper>
      <Navbar />
      <ContentArea>
        <SignInCard>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <SignUpLinkText>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </SignUpLinkText>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                id="username"
                placeholder="your_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <ForgotPasswordLink to="/forgot-password">Forgot Password?</ForgotPasswordLink>
            </FormGroup>

            <SubmitButton type="submit">Sign in</SubmitButton>
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </form>
        </SignInCard>
      </ContentArea>
    </PageWrapper>
  );
};

export default SignInPage;