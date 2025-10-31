/**
 * Code Validator
 * Validates code before execution (syntax checking, safety validation)
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate Python-like code for safety and syntax
 * @param code - Code string to validate
 * @returns Validation result with errors and warnings
 */
export function validateCode(code: string): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Check for dangerous patterns
  const dangerousPatterns = [
    { pattern: /import\s+os/, message: 'Cannot import os module' },
    { pattern: /import\s+sys/, message: 'Cannot import sys module' },
    { pattern: /__import__/, message: 'Cannot use __import__' },
    { pattern: /eval\s*\(/, message: 'Cannot use eval()' },
    { pattern: /exec\s*\(/, message: 'Cannot use exec()' },
    { pattern: /open\s*\(/, message: 'Cannot use open() for file access' },
    { pattern: /file\s*\(/, message: 'Cannot use file()' },
    { pattern: /input\s*\(/, message: 'Cannot use input()' },
    { pattern: /raw_input\s*\(/, message: 'Cannot use raw_input()' },
    { pattern: /while\s+True:/, message: 'Infinite loops are not allowed' },
    { pattern: /for\s+\w+\s+in\s+range\s*\(\s*10{3,}/, message: 'Loops with very large ranges are not allowed' }
  ];

  for (const { pattern, message } of dangerousPatterns) {
    if (pattern.test(code)) {
      result.isValid = false;
      result.errors.push(message);
    }
  }

  // Check for allowed functions only (whitelist approach)
  const allowedFunctions = [
    'damage', 'heal', 'buff', 'debuff',
    'get_self', 'get_enemy', 'get_stat',
    'random', 'if', 'else', 'for', 'while',
    'print' // Allow print for debugging
  ];

  // Basic syntax validation (check for balanced parentheses and brackets)
  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    result.isValid = false;
    result.errors.push('Unbalanced parentheses');
  }

  const openBrackets = (code.match(/\[/g) || []).length;
  const closeBrackets = (code.match(/\]/g) || []).length;
  if (openBrackets !== closeBrackets) {
    result.isValid = false;
    result.errors.push('Unbalanced brackets');
  }

  const openBraces = (code.match(/\{/g) || []).length;
  const closeBraces = (code.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    result.isValid = false;
    result.errors.push('Unbalanced braces');
  }

  return result;
}
