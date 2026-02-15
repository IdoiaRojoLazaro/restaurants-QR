interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

/**
 * Card Component
 * Reusable card container
 */
const Card = ({
  children,
  className = '',
  onClick,
  hover = false,
}: CardProps) => {
  const hoverClass = hover
    ? 'hover:shadow-lg transition-shadow cursor-pointer'
    : '';

  return (
    <div className={`card ${hoverClass} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
