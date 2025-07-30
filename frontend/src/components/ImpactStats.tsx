import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '@/styles/theme';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const countUp = keyframes`
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15);
  }
  50% {
    box-shadow: 0 8px 30px rgba(59, 130, 246, 0.25);
  }
`;

const StatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.xl};
  margin: ${theme.spacing['3xl']} 0;
  padding: 0 ${theme.spacing.lg};
  position: relative;

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
    padding: 0 ${theme.spacing.base};
  }
`;

const StatCard = styled(motion.div)`
  background: ${theme.colors.background.glass};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  text-align: center;
  box-shadow: ${theme.shadows.glass};
  transition: all ${theme.transitions.smooth};
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -200%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: all 0.6s;
    background-size: 200% 100%;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: ${theme.shadows.glassHover};
    border-color: ${theme.colors.primary[300]};
    animation: ${pulse} 2s ease-in-out infinite;
    
    &::before {
      left: 200%;
      animation: ${shimmer} 0.6s ease-in-out;
    }
  }

  .dark & {
    background: rgba(15, 23, 42, 0.8);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const StatNumber = styled(motion.div)`
  font-size: ${theme.typography.fontSize['4xl']};
  font-weight: ${theme.typography.fontWeight.extrabold};
  background: ${theme.colors.primary.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${theme.spacing.sm};
  font-family: ${theme.typography.fontFamily.sans};
  line-height: ${theme.typography.lineHeight.tight};
  animation: ${countUp} 0.8s ease-out;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 3px;
    background: ${theme.colors.primary.gradient};
    border-radius: ${theme.borderRadius.full};
    opacity: 0.7;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize['3xl']};
  }
`;

const StatLabel = styled(motion.div)`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.primary};
  font-weight: ${theme.typography.fontWeight.semibold};
  font-family: ${theme.typography.fontFamily.sans};
  margin-bottom: ${theme.spacing.xs};
  line-height: ${theme.typography.lineHeight.tight};

  .dark & {
    color: ${theme.colors.text.inverse};
  }
`;

const StatDescription = styled(motion.div)`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.fontWeight.medium};
  font-family: ${theme.typography.fontFamily.sans};
  opacity: 0.8;
  line-height: ${theme.typography.lineHeight.relaxed};

  .dark & {
    color: ${theme.colors.text.muted};
  }
`;

const StatsTitle = styled(motion.h2)`
  text-align: center;
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  background: ${theme.colors.primary.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${theme.spacing.xl};
  font-family: ${theme.typography.fontFamily.sans};

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize['2xl']};
  }
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <>
      <StatsTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Impact Statistics
      </StatsTitle>
      <StatsContainer
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <StatNumber
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: index * 0.2 + 0.5,
                type: "spring" as const,
                stiffness: 150
              }}
            >
              {stat.number}
            </StatNumber>
            <StatLabel
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.2 + 0.7 }}
            >
              {stat.label}
            </StatLabel>
            <StatDescription
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.2 + 0.9 }}
            >
              {stat.description}
            </StatDescription>
          </StatCard>
        ))}
      </StatsContainer>
    </>
  );
};

export default ImpactStats;
