import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, FileText, Users, CheckCircle } from 'lucide-react';
import { useCompanyConfig } from '../components/ThemeProvider';
import { FormField } from '../components/FormField';
import { PhoneInput } from '../components/PhoneInput';
import { HostSelect } from '../components/HostSelect';
import { ProgressBar } from '../components/ProgressBar';
import { OptimizedImage } from '../components/OptimizedImage';
import { useVisitorForm } from '../hooks/useVisitorForm';
import { useNetworkOptimization } from '../hooks/useNetworkOptimization';

export const VisitorForm: React.FC = () => {
  const navigate = useNavigate();
  const config = useCompanyConfig();
  const { formData, errors, isSubmitting, updateField, submitForm } = useVisitorForm();
  const { networkInfo, isSlowConnection } = useNetworkOptimization();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Calculate progress based on filled fields
  const progress = useMemo(() => {
    const fields = [
      formData.visitorName.trim(),
      formData.visitorEmail.trim(),
      formData.phoneNumber.trim(),
      formData.purposeOfVisit.trim(),
      formData.host
    ];
    
    const filledFields = fields.filter(field => field !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitForm();
    if (success) {
      setIsSubmitted(true);
    }
  };


  const handleRegisterAnother = () => {
    setIsSubmitted(false);
    window.location.reload();
  };

  const handleViewDashboard = () => {
    setIsSubmitted(false);
    navigate('/dashboard');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 via-white to-brand-secondary-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-brand-accent mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
            <p className="text-sm sm:text-base text-gray-600">
              Thank you for registering. You will receive a confirmation email shortly.
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={handleRegisterAnother}
              className="w-full bg-brand-gradient text-white py-3 px-6 rounded-lg font-medium hover:shadow-brand transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
            >
              Register Another Visitor
            </button>
            <button
              onClick={handleViewDashboard}
              className="w-full bg-white border-2 border-brand-primary text-brand-primary py-3 px-6 rounded-lg font-medium hover:bg-brand-primary-50 transition-all duration-200 text-sm sm:text-base"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 via-white to-brand-secondary-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-lg sm:max-w-xl lg:max-w-3xl">
        {/* Header with Large Logo */}
        <div className="bg-brand-gradient p-6 sm:p-8 lg:p-12 text-center">
          <div className="mb-6 sm:mb-8">
            <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg inline-block">
              <OptimizedImage
                src={config.logo} 
                alt={`${config.name} Logo`} 
                className="h-16 sm:h-20 md:h-24 lg:h-32 xl:h-36 mx-auto object-contain"
                priority={true}
                width={144}
                height={144}
              />
            </div>
          </div>
          <h1 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Visitor Registration</h1>
          {!networkInfo.isOnline && (
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4">
              <p className="text-sm">You're currently offline. Please check your connection.</p>
            </div>
          )}
          {isSlowConnection && networkInfo.isOnline && (
            <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg mb-4">
              <p className="text-sm">Slow connection detected. Form submission may take longer.</p>
            </div>
          )}
          <p className="text-white/80 text-sm sm:text-base lg:text-lg">
            Please fill out the form below to register your visit
          </p>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="p-4 sm:p-6 lg:p-8 pb-0">
          <ProgressBar progress={progress} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <FormField icon={User} label="Visitor Name" error={errors.visitorName}>
              <input
                type="text"
                value={formData.visitorName}
                onChange={(e) => updateField('visitorName', e.target.value)}
                placeholder="Enter your full name"
                className={`w-full border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.visitorName ? 'border-red-300' : 'border-gray-300'
                }`}
                style={{
                  '--tw-ring-color': 'var(--color-primary)'
                } as React.CSSProperties}
              />
            </FormField>

            <FormField icon={Mail} label="Email Address" error={errors.visitorEmail}>
              <input
                type="email"
                value={formData.visitorEmail}
                onChange={(e) => updateField('visitorEmail', e.target.value)}
                placeholder="Enter your email address"
                className={`w-full border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.visitorEmail ? 'border-red-300' : 'border-gray-300'
                }`}
                style={{
                  '--tw-ring-color': 'var(--color-primary)'
                } as React.CSSProperties}
              />
            </FormField>
          </div>

          <FormField icon={Phone} label="Phone Number" error={errors.phoneNumber}>
            <PhoneInput
              countryCode={formData.countryCode}
              phoneNumber={formData.phoneNumber}
              onCountryCodeChange={(code) => updateField('countryCode', code)}
              onPhoneNumberChange={(number) => updateField('phoneNumber', number)}
              error={errors.phoneNumber}
            />
          </FormField>

          <FormField icon={FileText} label="Purpose of Visit" error={errors.purposeOfVisit}>
            <textarea
              value={formData.purposeOfVisit}
              onChange={(e) => updateField('purposeOfVisit', e.target.value)}
              placeholder="Briefly describe the purpose of your visit"
              rows={3}
              className={`w-full border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                errors.purposeOfVisit ? 'border-red-300' : 'border-gray-300'
              }`}
              style={{
                '--tw-ring-color': 'var(--color-primary)'
              } as React.CSSProperties}
            />
          </FormField>

          <FormField icon={Users} label="Host" error={errors.host}>
            <HostSelect
              value={formData.host}
              onChange={(value) => updateField('host', value)}
              error={errors.host}
            />
          </FormField>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-gradient text-white py-3 px-6 rounded-lg font-medium hover:shadow-brand transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </div>
            ) : (
              'Submit Registration'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Your information will be kept confidential and used only for visit management purposes.
          </p>
        </div>
      </div>
    </div>
  );
};