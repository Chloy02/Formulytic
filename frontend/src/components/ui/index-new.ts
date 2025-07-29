import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

// Button Component
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  as?: React.ElementType;
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
