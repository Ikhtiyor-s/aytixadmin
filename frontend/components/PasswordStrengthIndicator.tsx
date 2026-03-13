import React from 'react'
import { validatePassword, getPasswordStrengthLabel, getPasswordStrengthColor } from '@/utils/passwordValidation'

interface PasswordStrengthIndicatorProps {
  password: string
  showFeedback?: boolean
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showFeedback = true,
}) => {
  if (!password) return null

  const strength = validatePassword(password)
  const strengthLabel = getPasswordStrengthLabel(strength.score)
  const strengthColor = getPasswordStrengthColor(strength.score)
  const widthPercentage = (strength.score / 5) * 100

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300 rounded-full"
            style={{
              width: `${widthPercentage}%`,
              backgroundColor: strengthColor,
            }}
          />
        </div>
        <span
          className="text-xs font-medium min-w-[80px]"
          style={{ color: strengthColor }}
        >
          {strengthLabel}
        </span>
      </div>

      {/* Feedback messages */}
      {showFeedback && strength.feedback.length > 0 && (
        <ul className="space-y-1">
          {strength.feedback.map((message, index) => (
            <li key={index} className="text-xs text-red-600 flex items-start gap-1">
              <svg
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{message}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Success message */}
      {strength.isValid && (
        <div className="text-xs text-green-600 flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Parol talablarga javob beradi</span>
        </div>
      )}
    </div>
  )
}
