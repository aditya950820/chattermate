export interface PasswordStrength {
  score: number
  hasMinLength: boolean
  hasUpperCase: boolean
  hasLowerCase: boolean
  hasNumber: boolean
  hasSpecialChar: boolean
}

export const validatePassword = (password: string): PasswordStrength => {
  const strength = {
    score: 0,
    hasMinLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password),
  }

  strength.score = [
    strength.hasMinLength,
    strength.hasUpperCase,
    strength.hasLowerCase,
    strength.hasNumber,
    strength.hasSpecialChar,
  ].filter(Boolean).length

  return strength
}

export const validateDomain = (domain: string): boolean => {
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
  return domainRegex.test(domain)
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

export const validateName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 100 && /^[a-zA-Z0-9\s\-']+$/.test(name)
}

export const validateOrgName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 100 && /^[a-zA-Z0-9\s\-'&.]+$/.test(name)
}
