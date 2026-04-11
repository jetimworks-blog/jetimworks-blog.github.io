import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const variants = {
  default: 'card',
  elevated: 'card shadow-xl',
  bordered: 'card border-2 border-navy-200',
};

export const Card = ({
  children,
  variant = 'default',
  className = '',
  title,
  hoverable = false,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -4 } : {}}
      className={clsx(
        variants[variant],
        hoverable && 'card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {title && (
        <h3 className="text-xl font-serif font-bold text-navy-800 mb-4">{title}</h3>
      )}
      {children}
    </motion.div>
  );
};

export default Card;
