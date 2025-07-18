import React, { ReactNode } from 'react';

interface ShowIfProps {
  condition: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ShowIf component - conditionally renders content based on a boolean condition
 * 
 * @param condition - Boolean condition to determine if content should be shown
 * @param children - Content to render when condition is true
 * @param fallback - Optional content to render when condition is false
 * 
 * @example
 * <ShowIf condition={isLoading}>
 *   <CircularProgress />
 * </ShowIf>
 * 
 * @example
 * <ShowIf condition={hasData} fallback={<EmptyState />}>
 *   <DataTable data={data} />
 * </ShowIf>
 */
const ShowIf: React.FC<ShowIfProps> = ({ condition, children, fallback = null }) => {
  if (condition) {
    return <>{children}</>;
  }
  if(fallback) {
    return <>{fallback}</>;
  }
  
  return null;
};

export default ShowIf; 