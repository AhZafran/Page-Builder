/**
 * Input component with validation and error display
 */

import * as React from 'react'
import { Input } from './input'
import { Label } from './label'
import { cn } from '@/lib/utils'
import type { ValidationResult } from '@/lib/input-validation'
import { AlertCircle } from 'lucide-react'

export interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  validationResult?: ValidationResult
  onValidate?: (value: string) => ValidationResult
  showErrorIcon?: boolean
}

export const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  (
    {
      className,
      label,
      error,
      validationResult,
      onValidate,
      showErrorIcon = true,
      onChange,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [internalError, setInternalError] = React.useState<string | undefined>()
    const [touched, setTouched] = React.useState(false)

    // Use external validation result or internal error
    const displayError = touched ? (validationResult?.error || error || internalError) : undefined
    const hasError = touched && !!(displayError)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Call external onChange
      onChange?.(e)

      // Run validation if provided
      if (onValidate && touched) {
        const result = onValidate(e.target.value)
        setInternalError(result.error)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true)

      // Run validation on blur
      if (onValidate) {
        const result = onValidate(e.target.value)
        setInternalError(result.error)
      }

      // Call external onBlur
      onBlur?.(e)
    }

    return (
      <div className="space-y-1.5">
        {label && (
          <Label htmlFor={props.id} className={cn(hasError && 'text-red-600')}>
            {label}
          </Label>
        )}
        <div className="relative">
          <Input
            ref={ref}
            className={cn(
              hasError && 'border-red-500 focus-visible:ring-red-500',
              showErrorIcon && hasError && 'pr-10',
              className
            )}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${props.id}-error` : undefined}
            {...props}
          />
          {showErrorIcon && hasError && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
          )}
        </div>
        {hasError && (
          <p
            id={`${props.id}-error`}
            className="text-xs text-red-600 flex items-center gap-1"
            role="alert"
          >
            {displayError}
          </p>
        )}
      </div>
    )
  }
)

ValidatedInput.displayName = 'ValidatedInput'
