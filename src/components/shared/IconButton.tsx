import React from 'react'

interface IconButtonProps {
  onClick: () => void
  'aria-label': string
  title?: string
  children: React.ReactNode
  variant?: 'ghost' | 'danger'
  disabled?: boolean
  className?: string
}

export function IconButton({
  onClick,
  'aria-label': ariaLabel,
  title,
  children,
  variant = 'ghost',
  disabled = false,
  className = '',
}: IconButtonProps) {
  const base = 'inline-flex items-center justify-center w-7 h-7 rounded text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-40 disabled:cursor-not-allowed'
  const variants = {
    ghost: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
    danger: 'text-gray-400 hover:text-red-600 hover:bg-red-50',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      title={title ?? ariaLabel}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
