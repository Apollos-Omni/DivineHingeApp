import React, { ReactNode } from 'react';
import { cn } from '../../lib/utils'; // if you have a utility like classNames
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

// Optional: motion wrapper for animated cards
export const Card = ({ children, className }: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const CardContent = ({ children, className }: CardContentProps) => {
  return (
    <div className={cn('p-4', className)}>
      {children}
    </div>
  );
};
