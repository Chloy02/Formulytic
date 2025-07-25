'use client';

import styled, { css } from 'styled-components';

interface SelectProps {
  hasError?: boolean;
  fullWidth?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}

const StyledSelect = styled.select<{ hasError?: boolean; fullWidth?: boolean }>`
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  color: #1a202c;
  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.25rem;
  appearance: none;
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:hover {
    border-color: #93c5fd;
  }

  ${({ hasError }) => hasError && css`
    border-color: #ef4444;
    
    &:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}

  .dark & {
    background-color: #1e293b;
    border-color: #334155;
    color: #f1f5f9;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    
    &:focus {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
    }

    &:hover {
      border-color: #475569;
    }

    ${({ hasError }) => hasError && css`
      border-color: #f87171;
      
      &:focus {
        border-color: #f87171;
        box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.1);
      }
    `}
  }

  option {
    background-color: #ffffff;
    color: #1a202c;
    padding: 0.5rem;

    .dark & {
      background-color: #1e293b;
      color: #f1f5f9;
    }
  }
`;

export const Select: React.FC<SelectProps> = ({ children, ...props }) => {
  return <StyledSelect {...props}>{children}</StyledSelect>;
};

export default Select;
