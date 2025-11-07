
import React from 'react';

interface PointCardProps {
  title: string;
  amount: number;
  pointName: string;
  description: string;
  color: 'purple' | 'green';
}

export const PointCard: React.FC<PointCardProps> = ({ title, amount, pointName, description, color }) => {
  const colorClasses = {
    purple: {
      bg: 'bg-purple-900/30',
      border: 'border-purple-500/50',
      text: 'text-purple-300',
      shadow: 'shadow-purple-500/20'
    },
    green: {
      bg: 'bg-green-900/30',
      border: 'border-green-500/50',
      text: 'text-green-300',
      shadow: 'shadow-green-500/20'
    }
  };

  const currentTheme = colorClasses[color];

  return (
    <div className={`w-full md:w-80 p-6 border ${currentTheme.border} ${currentTheme.bg} rounded-lg shadow-lg ${currentTheme.shadow} flex flex-col items-center text-center`}>
      <p className="text-gray-400">{title}</p>
      <h3 className={`text-7xl font-bold my-2 ${currentTheme.text}`}>{amount}</h3>
      <p className={`font-cinzel tracking-widest ${currentTheme.text}`}>{pointName}</p>
      <hr className={`w-1/2 my-4 border-gray-600`} />
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
};
