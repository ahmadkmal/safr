import styled from '@emotion/styled';

export const TableContainer = styled.div`
  padding: 20px;
  max-width: 100%;
  overflow-x: auto;
`;

export const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  position: relative;
  border: 1px solid #e5e7eb;
`;

export const TableHeader = styled.th`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  user-select: none;
  position: relative;
  font-size: 0.875rem;
  letter-spacing: 0.025em;
  
  &:hover {
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    cursor: grab;
  }
  
  &:active {
    cursor: grabbing;
    background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  }

  &:first-of-type {
    border-top-left-radius: 12px;
  }

  &:last-of-type {
    border-top-right-radius: 12px;
  }
`;

export const TableCell = styled.td<{ isEdited?: boolean }>`
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  background: ${({ isEdited }) => 
    isEdited 
      ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' 
      : '#ffffff'
  };
  transition: all 0.2s ease-in-out;
  position: relative;

  &:hover {
    background: ${({ isEdited }) => 
      isEdited 
        ? 'linear-gradient(135deg, #fde68a 0%, #fbbf24 100%)' 
        : '#f8fafc'
    };
  }

  &:first-of-type {
    border-left: ${({ isEdited }) => 
      isEdited ? '3px solid #f59e0b' : 'none'
    };
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ isEdited }) => 
      isEdited 
        ? 'linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.1) 50%, transparent 100%)' 
        : 'none'
    };
    pointer-events: none;
    opacity: ${({ isEdited }) => isEdited ? 1 : 0};
    transition: opacity 0.3s ease-in-out;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin: 4px 0;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;
  background: #ffffff;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:hover {
    border-color: #9ca3af;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const SaveButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.025em;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

  &:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
  }

  &:disabled {
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;