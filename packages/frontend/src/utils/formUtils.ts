export const getFieldError = (errors: any, fieldName: string): string | undefined => {
  const fieldNames = fieldName.split('.');
  let current = errors;
  
  for (const name of fieldNames) {
    if (current && typeof current === 'object' && name in current) {
      current = current[name];
    } else {
      return undefined;
    }
  }
  
  return current?.message;
}; 