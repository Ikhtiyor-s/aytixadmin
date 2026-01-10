/**
 * Password validation utility with strong security rules
 * Following OWASP password security guidelines
 */

export interface PasswordStrength {
  score: number // 0-4 (weak to strong)
  feedback: string[]
  isValid: boolean
}

export interface PasswordValidationRules {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
}

const DEFAULT_RULES: PasswordValidationRules = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
}

/**
 * Validates password against security rules
 */
export function validatePassword(
  password: string,
  rules: PasswordValidationRules = DEFAULT_RULES
): PasswordStrength {
  const feedback: string[] = []
  let score = 0

  // Check minimum length
  if (password.length < rules.minLength) {
    feedback.push(`Parol kamida ${rules.minLength} ta belgidan iborat bo'lishi kerak`)
  } else {
    score++
  }

  // Check for uppercase letters
  if (rules.requireUppercase && !/[A-Z]/.test(password)) {
    feedback.push('Parolda kamida bitta katta harf bo\'lishi kerak')
  } else if (rules.requireUppercase) {
    score++
  }

  // Check for lowercase letters
  if (rules.requireLowercase && !/[a-z]/.test(password)) {
    feedback.push('Parolda kamida bitta kichik harf bo\'lishi kerak')
  } else if (rules.requireLowercase) {
    score++
  }

  // Check for numbers
  if (rules.requireNumbers && !/[0-9]/.test(password)) {
    feedback.push('Parolda kamida bitta raqam bo\'lishi kerak')
  } else if (rules.requireNumbers) {
    score++
  }

  // Check for special characters
  if (rules.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('Parolda kamida bitta maxsus belgi bo\'lishi kerak (!@#$%^&*...)')
  } else if (rules.requireSpecialChars) {
    score++
  }

  // Check for common weak passwords
  const commonPasswords = [
    '123456', 'password', '12345678', 'qwerty', '123456789', '12345',
    '1234', '111111', '1234567', 'dragon', '123123', 'baseball', 'iloveyou',
    'trustno1', '1234567890', 'sunshine', 'master', '123321', 'letmein',
    'welcome', 'monkey', 'login', 'admin', 'password123', 'qwerty123'
  ]

  if (commonPasswords.includes(password.toLowerCase())) {
    feedback.push('Bu parol juda oddiy va xavfli. Murakkabroq parol tanlang')
    score = 0
  }

  // Check for sequential characters
  if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password)) {
    feedback.push('Parolda ketma-ket belgilar ishlatmang')
  }

  // Check for repeating characters
  if (/(.)\1{2,}/.test(password)) {
    feedback.push('Parolda bir xil belgilarni takrorlamang')
  }

  const isValid = feedback.length === 0

  return {
    score: isValid ? score : Math.max(0, score - 1),
    feedback,
    isValid,
  }
}

/**
 * Gets password strength label
 */
export function getPasswordStrengthLabel(score: number): string {
  switch (score) {
    case 0:
    case 1:
      return 'Juda zaif'
    case 2:
      return 'Zaif'
    case 3:
      return 'O\'rtacha'
    case 4:
      return 'Kuchli'
    case 5:
      return 'Juda kuchli'
    default:
      return 'Zaif'
  }
}

/**
 * Gets password strength color
 */
export function getPasswordStrengthColor(score: number): string {
  switch (score) {
    case 0:
    case 1:
      return '#ef4444' // red
    case 2:
      return '#f59e0b' // amber
    case 3:
      return '#eab308' // yellow
    case 4:
    case 5:
      return '#22c55e' // green
    default:
      return '#ef4444'
  }
}

/**
 * Sanitizes user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 255) // Limit length
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates phone number format (Uzbekistan)
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^(\+998)?[0-9]{9}$/
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ''))
}
