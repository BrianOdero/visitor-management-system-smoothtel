import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FormFieldProps {
  icon: LucideIcon;
  label: string;
  error?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ icon: Icon, label, error, children }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm">{label}</span>
        </div>
      </label>
      {children}
      {error && (
        <p className="text-xs sm:text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};