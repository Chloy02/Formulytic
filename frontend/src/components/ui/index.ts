import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

// Button Component
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  as?: any;
  href?: string;
}

export const Button = styled(motion.button).withConfig({
  shouldForwardProp: (prop) => !['variant', 'size', 'fullWidth'].includes(prop)
})<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-weight: 500;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  position: relative;
  overflow: hidden;

  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          height: 2.25rem;
        `;
      case 'lg':
        return css`
          padding: 0.75rem 2rem;
          font-size: 1.125rem;
          height: 3rem;
        `;
      default:
        return css`
          padding: 0.625rem 1.5rem;
          font-size: 1rem;
          height: 2.75rem;
        `;
    }
  }}

  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: #f1f5f9;
          color: #334155;
          &:hover:not(:disabled) {
            background-color: #e2e8f0;
            transform: translateY(-1px);
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          }
          .dark & {
            background-color: #1e293b;
            color: #cbd5e1;
            &:hover:not(:disabled) {
              background-color: #334155;
            }
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: #2563eb;
          border: 1px solid #93c5fd;
          &:hover:not(:disabled) {
            background-color: #eff6ff;
            border-color: #60a5fa;
            transform: translateY(-1px);
          }
          .dark & {
            color: #60a5fa;
            border-color: #1e40af;
            &:hover:not(:disabled) {
              background-color: #1e293b;
              border-color: #2563eb;
            }
          }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: #475569;
          &:hover:not(:disabled) {
            background-color: #f1f5f9;
          }
          .dark & {
            color: #cbd5e1;
            &:hover:not(:disabled) {
              background-color: #1e293b;
            }
          }
        `;
      default:
        return css`
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: #ffffff;
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          }
        `;
    }
  }}

  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

// Card Component
export const Card = styled.div`
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }

  .dark & {
    background-color: #0f172a;
    border-color: #334155;
  }
`;

// Typography Components
interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  color?: 'primary' | 'secondary' | 'tertiary';
  align?: 'left' | 'center' | 'right';
}

export const Heading = styled.h1.withConfig({
  shouldForwardProp: (prop) => !['level', 'color', 'align'].includes(prop)
})<HeadingProps>`
  margin: 0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-weight: 700;
  line-height: 1.25;
  text-align: ${({ align = 'left' }) => align};

  ${({ level = 1 }) => {
    switch (level) {
      case 1:
        return css`font-size: 2.25rem;`;
      case 2:
        return css`font-size: 1.875rem;`;
      case 3:
        return css`font-size: 1.5rem;`;
      case 4:
        return css`font-size: 1.25rem;`;
      case 5:
        return css`font-size: 1.125rem;`;
      case 6:
        return css`font-size: 1rem;`;
      default:
        return css`font-size: 2.25rem;`;
    }
  }}

  ${({ color = 'primary' }) => {
    switch (color) {
      case 'secondary':
        return css`color: #475569;`;
      case 'tertiary':
        return css`color: #64748b;`;
      default:
        return css`color: #0f172a;`;
    }
  }}

  .dark & {
    ${({ color = 'primary' }) => {
      switch (color) {
        case 'secondary':
          return css`color: #cbd5e1;`;
        case 'tertiary':
          return css`color: #94a3b8;`;
        default:
          return css`color: #f1f5f9;`;
      }
    }}
  }
`;

// Text Component
interface TextProps {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'tertiary';
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

export const Text = styled.p.withConfig({
  shouldForwardProp: (prop) => !['size', 'color', 'align', 'weight'].includes(prop)
})<TextProps>`
  margin: 0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  text-align: ${({ align = 'left' }) => align};

  ${({ size = 'base' }) => {
    switch (size) {
      case 'xs':
        return css`font-size: 0.75rem;`;
      case 'sm':
        return css`font-size: 0.875rem;`;
      case 'lg':
        return css`font-size: 1.125rem;`;
      case 'xl':
        return css`font-size: 1.25rem;`;
      default:
        return css`font-size: 1rem;`;
    }
  }}

  ${({ weight = 'normal' }) => {
    switch (weight) {
      case 'medium':
        return css`font-weight: 500;`;
      case 'semibold':
        return css`font-weight: 600;`;
      case 'bold':
        return css`font-weight: 700;`;
      default:
        return css`font-weight: 400;`;
    }
  }}

  ${({ color = 'primary' }) => {
    switch (color) {
      case 'secondary':
        return css`color: #475569;`;
      case 'tertiary':
        return css`color: #64748b;`;
      default:
        return css`color: #0f172a;`;
    }
  }}

  .dark & {
    ${({ color = 'primary' }) => {
      switch (color) {
        case 'secondary':
          return css`color: #cbd5e1;`;
        case 'tertiary':
          return css`color: #94a3b8;`;
        default:
          return css`color: #f1f5f9;`;
      }
    }}
  }
`;

// Container Component
interface ContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) => !['maxWidth', 'padding'].includes(prop)
})<ContainerProps>`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: ${({ padding = true }) => padding ? '1rem' : '0'};
  padding-right: ${({ padding = true }) => padding ? '1rem' : '0'};

  ${({ maxWidth = 'full' }) => {
    switch (maxWidth) {
      case 'sm':
        return css`max-width: 640px;`;
      case 'md':
        return css`max-width: 768px;`;
      case 'lg':
        return css`max-width: 1024px;`;
      case 'xl':
        return css`max-width: 1280px;`;
      default:
        return css`max-width: none;`;
    }
  }}
`;

// Stack Component
interface StackProps {
  direction?: 'row' | 'column';
  spacing?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

export const Stack = styled.div.withConfig({
  shouldForwardProp: (prop) => !['direction', 'spacing', 'align', 'justify'].includes(prop)
})<StackProps>`
  display: flex;
  flex-direction: ${({ direction = 'column' }) => direction};

  ${({ spacing = 'base' }) => {
    const spaceValue = {
      xs: '0.25rem',
      sm: '0.5rem',
      base: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    }[spacing];

    return css`gap: ${spaceValue};`;
  }}

  ${({ align }) => {
    if (!align) return '';
    switch (align) {
      case 'start':
        return css`align-items: flex-start;`;
      case 'center':
        return css`align-items: center;`;
      case 'end':
        return css`align-items: flex-end;`;
      case 'stretch':
        return css`align-items: stretch;`;
      default:
        return '';
    }
  }}

  ${({ justify }) => {
    if (!justify) return '';
    switch (justify) {
      case 'start':
        return css`justify-content: flex-start;`;
      case 'center':
        return css`justify-content: center;`;
      case 'end':
        return css`justify-content: flex-end;`;
      case 'between':
        return css`justify-content: space-between;`;
      case 'around':
        return css`justify-content: space-around;`;
      case 'evenly':
        return css`justify-content: space-evenly;`;
      default:
        return '';
    }
  }}
`;

// Grid Component
interface GridProps {
  columns?: number | 'auto-fit' | 'auto-fill';
  rows?: number | 'auto-fit' | 'auto-fill';
  gap?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  minItemWidth?: string;
}

export const Grid = styled.div.withConfig({
  shouldForwardProp: (prop) => !['columns', 'rows', 'gap', 'minItemWidth'].includes(prop)
})<GridProps>`
  display: grid;

  ${({ columns = 'auto-fit', minItemWidth = '300px' }) => {
    if (typeof columns === 'number') {
      return css`grid-template-columns: repeat(${columns}, 1fr);`;
    } else {
      return css`grid-template-columns: repeat(${columns}, minmax(${minItemWidth}, 1fr));`;
    }
  }}

  ${({ rows }) => {
    if (typeof rows === 'number') {
      return css`grid-template-rows: repeat(${rows}, 1fr);`;
    } else if (rows === 'auto-fit' || rows === 'auto-fill') {
      return css`grid-template-rows: repeat(${rows}, minmax(min-content, max-content));`;
    }
    return '';
  }}

  ${({ gap = 'base' }) => {
    const gapValue = {
      xs: '0.25rem',
      sm: '0.5rem',
      base: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    }[gap];

    return css`gap: ${gapValue};`;
  }}
`;

// Input Component
interface InputProps {
  hasError?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Input = styled.input.withConfig({
  shouldForwardProp: (prop) => !['hasError', 'size', 'fullWidth', 'icon'].includes(prop)
})<InputProps>`
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  border-radius: 0.375rem;
  border: 1px solid ${({ hasError }) => hasError ? '#fca5a5' : '#e2e8f0'};
  background-color: #ffffff;
  color: #0f172a;
  transition: all 0.2s ease-in-out;
  box-sizing: border-box;
  padding-left: ${({ icon }) => icon ? '2.5rem' : '0.75rem'};

  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          padding-right: 0.75rem;
          font-size: 0.875rem;
          height: 2.25rem;
        `;
      case 'lg':
        return css`
          padding-top: 0.875rem;
          padding-bottom: 0.875rem;
          padding-right: 1rem;
          font-size: 1.125rem;
          height: 3.25rem;
        `;
      default:
        return css`
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
          padding-right: 1rem;
          font-size: 1rem;
          height: 2.75rem;
        `;
    }
  }}

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px #dbeafe;
  }

  &::placeholder {
    color: #64748b;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f1f5f9;
  }

  .dark & {
    background-color: #1e293b;
    border-color: ${({ hasError }) => hasError ? '#f87171' : '#475569'};
    color: #f1f5f9;

    &:focus {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
    }

    &::placeholder {
      color: #94a3b8;
    }

    &:disabled {
      background-color: #334155;
    }
  }
`;

// FormGroup Component
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

// Label Component
interface LabelProps {
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Label = styled.label.withConfig({
  shouldForwardProp: (prop) => !['required', 'size'].includes(prop)
})<LabelProps>`
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-weight: 500;
  color: #374151;
  display: block;

  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`font-size: 0.875rem;`;
      case 'lg':
        return css`font-size: 1.125rem;`;
      default:
        return css`font-size: 1rem;`;
    }
  }}

  ${({ required }) => required && css`
    &::after {
      content: ' *';
      color: #ef4444;
    }
  `}

  .dark & {
    color: #d1d5db;
  }
`;

// Alert Component
interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
}

export const Alert = styled.div.withConfig({
  shouldForwardProp: (prop) => !['variant'].includes(prop)
})<AlertProps>`
  padding: 1rem;
  border-radius: 0.375rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 0.875rem;
  border: 1px solid;

  ${({ variant = 'info' }) => {
    switch (variant) {
      case 'success':
        return css`
          background-color: #f0fdf4;
          border-color: #bbf7d0;
          color: #15803d;
        `;
      case 'warning':
        return css`
          background-color: #fffbeb;
          border-color: #fde68a;
          color: #b45309;
        `;
      case 'error':
        return css`
          background-color: #fef2f2;
          border-color: #fecaca;
          color: #b91c1c;
        `;
      default:
        return css`
          background-color: #eff6ff;
          border-color: #bfdbfe;
          color: #1d4ed8;
        `;
    }
  }}

  .dark & {
    ${({ variant = 'info' }) => {
      switch (variant) {
        case 'success':
          return css`
            background-color: rgba(34, 197, 94, 0.1);
            border-color: rgba(34, 197, 94, 0.3);
            color: #4ade80;
          `;
        case 'warning':
          return css`
            background-color: rgba(245, 158, 11, 0.1);
            border-color: rgba(245, 158, 11, 0.3);
            color: #fbbf24;
          `;
        case 'error':
          return css`
            background-color: rgba(239, 68, 68, 0.1);
            border-color: rgba(239, 68, 68, 0.3);
            color: #f87171;
          `;
        default:
          return css`
            background-color: rgba(59, 130, 246, 0.1);
            border-color: rgba(59, 130, 246, 0.3);
            color: #60a5fa;
          `;
      }
    }}
  }
`;

// Select Component
interface SelectProps {
  hasError?: boolean;
  fullWidth?: boolean;
}

export const Select = styled.select.withConfig({
  shouldForwardProp: (prop) => !['hasError', 'fullWidth'].includes(prop)
})<SelectProps>`
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
