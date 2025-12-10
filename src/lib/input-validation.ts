/**
 * Input validation utilities for form fields
 */

export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Validates URL format
 */
export function validateURL(url: string, required = true): ValidationResult {
  if (!required && !url) {
    return { isValid: true }
  }

  if (!url || url.trim() === '') {
    return { isValid: false, error: 'URL is required' }
  }

  try {
    new URL(url)
    return { isValid: true }
  } catch {
    return { isValid: false, error: 'Invalid URL format' }
  }
}

/**
 * Validates YouTube URL
 */
export function validateYouTubeURL(url: string): ValidationResult {
  if (!url || url.trim() === '') {
    return { isValid: false, error: 'YouTube URL is required' }
  }

  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
  if (!youtubeRegex.test(url)) {
    return { isValid: false, error: 'Must be a valid YouTube URL' }
  }

  return { isValid: true }
}

/**
 * Validates email address
 */
export function validateEmail(email: string, required = true): ValidationResult {
  if (!required && !email) {
    return { isValid: true }
  }

  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' }
  }

  return { isValid: true }
}

/**
 * Validates hex color format
 */
export function validateColor(color: string): ValidationResult {
  if (!color || color.trim() === '') {
    return { isValid: false, error: 'Color is required' }
  }

  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  if (!hexRegex.test(color)) {
    return { isValid: false, error: 'Must be a valid hex color (e.g., #FF0000)' }
  }

  return { isValid: true }
}

/**
 * Validates number within range
 */
export function validateNumber(
  value: number | string,
  options: {
    min?: number
    max?: number
    required?: boolean
    integer?: boolean
  } = {}
): ValidationResult {
  const { min, max, required = true, integer = false } = options

  if (!required && (value === '' || value === null || value === undefined)) {
    return { isValid: true }
  }

  const num = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(num)) {
    return { isValid: false, error: 'Must be a valid number' }
  }

  if (integer && !Number.isInteger(num)) {
    return { isValid: false, error: 'Must be a whole number' }
  }

  if (min !== undefined && num < min) {
    return { isValid: false, error: `Must be at least ${min}` }
  }

  if (max !== undefined && num > max) {
    return { isValid: false, error: `Must be at most ${max}` }
  }

  return { isValid: true }
}

/**
 * Validates text length
 */
export function validateTextLength(
  text: string,
  options: {
    minLength?: number
    maxLength?: number
    required?: boolean
  } = {}
): ValidationResult {
  const { minLength, maxLength, required = true } = options

  if (!required && !text) {
    return { isValid: true }
  }

  if (!text || text.trim() === '') {
    return { isValid: false, error: 'This field is required' }
  }

  if (minLength !== undefined && text.length < minLength) {
    return { isValid: false, error: `Must be at least ${minLength} characters` }
  }

  if (maxLength !== undefined && text.length > maxLength) {
    return { isValid: false, error: `Must be at most ${maxLength} characters` }
  }

  return { isValid: true }
}

/**
 * Validates date string
 */
export function validateDate(dateString: string, required = true): ValidationResult {
  if (!required && !dateString) {
    return { isValid: true }
  }

  if (!dateString || dateString.trim() === '') {
    return { isValid: false, error: 'Date is required' }
  }

  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date format' }
  }

  return { isValid: true }
}

/**
 * Validates future date
 */
export function validateFutureDate(dateString: string): ValidationResult {
  const dateValidation = validateDate(dateString)
  if (!dateValidation.isValid) {
    return dateValidation
  }

  const date = new Date(dateString)
  const now = new Date()

  if (date <= now) {
    return { isValid: false, error: 'Date must be in the future' }
  }

  return { isValid: true }
}

/**
 * Validates that a value is not empty
 */
export function validateRequired(value: any): ValidationResult {
  if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
    return { isValid: false, error: 'This field is required' }
  }

  return { isValid: true }
}
