import React from 'react';
import { ChevronDown } from 'lucide-react';
import { companyConfig } from '../config/company';

interface HostSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const HostSelect: React.FC<HostSelectProps> = ({ value, onChange, error }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none bg-white border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 pr-10 text-sm focus:outline-none focus:ring-2 ring-brand-primary focus:border-transparent transition-all duration-200 ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
      >
        <option value="">Select a host</option>
        {companyConfig.hosts.map((host) => (
          <option key={host.id} value={host.id}>
            {host.name} - {host.title}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
};