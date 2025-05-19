import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { clsx } from 'clsx';

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ 
    label, 
    name, 
    error, 
    hint, 
    size = 'md', 
    leftIcon, 
    rightIcon, 
    fullWidth = false,
    className,
    type = 'text',
    disabled,
    ...rest 
  }, ref) => {
    const baseStyles = 'border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors';
    
    const sizeStyles = {
      sm: 'text-xs py-1.5 px-2.5',
      md: 'text-sm py-2 px-3',
      lg: 'text-base py-2.5 px-4',
    };
    
    const stateStyles = clsx(
      error ? 'border-error-500 bg-error-50' : 'border-gray-300',
      disabled && 'bg-gray-100 cursor-not-allowed opacity-75'
    );
    
    const inputClasses = clsx(
      baseStyles,
      sizeStyles[size],
      stateStyles,
      leftIcon && 'pl-9',
      rightIcon && 'pr-9',
      fullWidth && 'w-full',
      className
    );
    
    return (
      <div className={clsx('mb-4', fullWidth && 'w-full')}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={name}
            name={name}
            type={type}
            className={inputClasses}
            disabled={disabled}
            {...rest}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
        
        {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
        {error && <p className="mt-1 text-xs text-error-600">{error}</p>}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;