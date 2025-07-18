import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from './components/Navbar'; // Import Navbar
import { Link, useNavigate } from 'react-router-dom'; // Keep Link import
import axios from 'axios';

// Styled Components for the Sign-Up Page

const PageWrapper = styled.div` /* NEW: Outer wrapper for the entire page */
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Takes full height */
  background-color: #f0f4f8; /* Light background color for the page */
  color: #333;
  width: 100%;
  overflow-x: hidden; /* Prevent horizontal scrollbar */
`;

const ContentArea = styled.div` /* NEW: Area for main content below Navbar */
  flex-grow: 1; /* Allows this area to take up all available vertical space */
  display: flex;
  justify-content: center; /* Center card horizontally */
  align-items: center; /* Center card vertically */
  padding: 20px; /* Padding around the card */
  box-sizing: border-box;
`;

const SignupCard = styled.div`
  background-color: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px; /* Max width for the card as in the image */
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

const RoleSelection = styled.div`
  margin-bottom: 30px;
  text-align: left;
`;

const RoleLabel = styled(Label)`
  font-size: 16px;
  color: #333;
  margin-bottom: 12px;
`;

const RadioOption = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  input[type="radio"] {
    margin-right: 10px;
    width: 18px;
    height: 18px;
    accent-color: #007bff;
  }

  label {
    margin-bottom: 0;
    font-weight: normal;
    font-size: 16px;
    cursor: pointer;
    color: #333;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #1a202c;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #000;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;


const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
        role,
      });
      navigate('/signin');
    } catch (error) {
      console.error('Signup failed', error);
      // Handle signup error
    }
  };

  return (
    <PageWrapper> {/* NEW: Use PageWrapper as the root */}
      <Navbar /> {/* Navbar stays at the top */}
      <ContentArea> {/* NEW: ContentArea fills remaining space and centers the card */}
        <SignupCard>
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
            <SignInLinkText>
              Already have an account? <Link to="/signin">Sign In</Link>
            </SignInLinkText>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                id="username"
                placeholder="john.doe"
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
                placeholder="you@example.com"
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
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormGroup>

            <RoleSelection>
              <RoleLabel>Role</RoleLabel>
              <RadioOption>
                <Input
                  type="radio"
                  id="userRole"
                  name="role"
                  value="user"
                  checked={role === 'user'}
                  onChange={(e) => setRole(e.target.value)}
                />
                <label htmlFor="userRole">User - Access questionnaires and submit feedback</label>
              </RadioOption>
              <RadioOption>
                <Input
                  type="radio"
                  id="adminRole"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={(e) => setRole(e.target.value)}
                />
                <label htmlFor="adminRole">Admin - Manage questionnaires and view analytics</label>
              </RadioOption>
            </RoleSelection>

            <SubmitButton type="submit">Sign up</SubmitButton>
          </form>
        </SignupCard>
      </ContentArea>
    </PageWrapper>
  );
};

export default SignUpPage;