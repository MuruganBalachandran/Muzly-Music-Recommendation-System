//region imports
import { useState, useCallback } from 'react';
//endregion

//region interfaces
type ValidationRule<T> = {
  [K in keyof T]?: (value: T[K]) => string | null;
};

interface UseFormValidationReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  handleChange: (field: keyof T, value: any) => void;
  validate: () => boolean;
  reset: (initialValues?: T) => void;
  setValues: (values: T) => void;
}
//endregion

//region hook
/**
 * Custom hook for form validation
 * Provides form state management with validation rules
 * 
 * @param initialValues - Initial form values
 * @param validationRules - Validation rules for each field
 * @returns Form state and handlers
 */
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRule<T>
): UseFormValidationReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach((key) => {
      const field = key as keyof T;
      const rule = validationRules[field];
      if (rule) {
        const error = rule(values[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  const reset = useCallback((newInitialValues?: T) => {
    setValues(newInitialValues || initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    handleChange,
    validate,
    reset,
    setValues
  };
}
//endregion
