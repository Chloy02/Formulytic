import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 40px 0;
  padding: 0 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
  border: 1px solid #e8f4fd;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.08);
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.6s ease forwards;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 123, 255, 0.15);
  }
`;

const StatNumber = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: #007bff;
  margin-bottom: 8px;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #555;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
`;

const StatDescription = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 4px;
  font-family: 'Inter', sans-serif;
`;

const ImpactStats: React.FC = () => {
  const stats = [
    {
      number: "12",
      label: "Districts Covered",
      description: "Out of 30 in Karnataka"
    },
    {
      number: "2,500+",
      label: "Families Surveyed",
      description: "SCSP/TSP beneficiaries"
    },
    {
      number: "85%",
      label: "Response Rate",
      description: "Survey completion"
    },
    {
      number: "₹15L",
      label: "Avg. Incentive",
      description: "Per beneficiary family"
    }
  ];

  return (
    <StatsContainer>
      {stats.map((stat, index) => (
        <StatCard key={index} style={{ animationDelay: `${index * 0.1}s` }}>
          <StatNumber>{stat.number}</StatNumber>
          <StatLabel>{stat.label}</StatLabel>
          <StatDescription>{stat.description}</StatDescription>
        </StatCard>
      ))}
    </StatsContainer>
  );
};

export default ImpactStats;
