// src/utils/errorUtils.ts

/**
 * Simple function to transform backend errors to user-friendly messages
 */
export function getFriendlyErrorMessage(error: unknown): string {
  if (!error) return '';
  
  console.log('Original error:', error);
  
  // If it's already a string
  if (typeof error === 'string') {
    return formatErrorMessage(error);
  }
  
  // If it's an Error object
  if (error instanceof Error) {
    return formatErrorMessage(error.message);
  }
  
  // If it's an object with a message property
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as any;
    
    // Check for common error response formats
    if (errorObj.message) {
      return formatErrorMessage(errorObj.message);
    }
    if (errorObj.error) {
      return formatErrorMessage(errorObj.error);
    }
    if (errorObj.data?.message) {
      return formatErrorMessage(errorObj.data.message);
    }
    if (errorObj.response?.data?.message) {
      return formatErrorMessage(errorObj.response.data.message);
    }
  }
  
  return 'Something went wrong. Please try again.';
}

/**
 * Format specific error messages to be user-friendly
 */
function formatErrorMessage(message: string): string {
  if (!message) return 'Something went wrong. Please try again.';
  
  console.log('Formatting message:', message);
  
  const lowerMessage = message.toLowerCase();
  
  // Handle JSON array format
  if (message.trim().startsWith('[')) {
    try {
      const errors = JSON.parse(message) as Array<{field?: string; message: string}>;
      const messages = errors.map(err => cleanMessage(err.message));
      return messages.join('. ');
    } catch {
      // If JSON parsing fails, continue with normal formatting
    }
  }
  
  // Handle common error patterns
  if (lowerMessage.includes('password must be at least 6') || lowerMessage.includes('password should be at least 6')) {
    return 'Password must be at least 6 characters long';
  }
  
  if (lowerMessage.includes('invalid email or password') || lowerMessage.includes('invalid credential') || lowerMessage.includes('email or password is incorrect')) {
    return 'Invalid email or password';
  }
  
  if (lowerMessage.includes('user not found') || lowerMessage.includes('no user found')) {
    return 'No account found with this email address';
  }
  
  if (lowerMessage.includes('email already exists') || lowerMessage.includes('user already exists') || lowerMessage.includes('email is already registered')) {
    return 'An account with this email already exists';
  }
  
  if (lowerMessage.includes('network') || lowerMessage.includes('connection') || lowerMessage.includes('fetch') || lowerMessage.includes('timeout')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  if (lowerMessage.includes('verification') || lowerMessage.includes('verify')) {
    return 'Verification failed. Please check your code and try again.';
  }
  
  if (lowerMessage.includes('reset code') || lowerMessage.includes('verification code')) {
    return 'Invalid or expired verification code';
  }
  
  if (lowerMessage.includes('required') || lowerMessage.includes('is required')) {
    return 'Please fill in all required fields';
  }
  
  if (lowerMessage.includes('email must be a valid email')) {
    return 'Please enter a valid email address';
  }
  
  // Clean up the message
  return cleanMessage(message);
}

/**
 * Clean technical details from error messages
 */
function cleanMessage(message: string): string {
  let cleaned = message
    .replace(/\[.*?\]/g, '') // Remove array brackets and content
    .replace(/\{.*?\}/g, '') // Remove object brackets and content
    .replace(/"/g, '') // Remove quotes
    .replace(/error:/gi, '') // Remove "error:" prefix
    .replace(/validation error:/gi, '') // Remove "validation error:" prefix
    .replace(/validation failed:/gi, '') // Remove "validation failed:" prefix
    .trim();

  // Capitalize first letter
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  
  return cleaned || 'Something went wrong. Please try again.';
}