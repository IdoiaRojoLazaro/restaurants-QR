import type {LucideIcon} from 'lucide-react';

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  icon?: LucideIcon;
  title?: string;
}

/**
 * Button Component
 * Reusable button with different variants
 */
const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  className = '',
  icon: Icon,
  title,
}: ButtonProps) => {
  const baseClasses =
    'rounded-full font-medium transition-colors duration-200 flex items-center justify-center gap-2';

  const variantClasses = {
    primary:
      'btn-main bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-300',
    secondary:
      'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300',
    ghost:
      'bg-transparent hover:bg-gray-100 disabled:bg-transparent disabled:text-gray-300',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      title={title}
    >
      {Icon && <Icon className='w-4 h-4' />}
      {children}
    </button>
  );
};

export default Button;
