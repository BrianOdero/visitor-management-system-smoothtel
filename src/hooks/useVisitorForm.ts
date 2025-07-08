import { useState } from 'react';
import { VisitorFormData } from '../types/visitor';
import { HOSTS } from '../data/constants';
import { sendVisitorNotificationEmail, generateVisitorNotificationEmail } from '../services/emailService';

interface FormErrors {
  visitorName?: string;
  visitorEmail?: string;
  phoneNumber?: string;
  purposeOfVisit?: string;
  host?: string;
}

export const useVisitorForm = () => {
  const [formData, setFormData] = useState<VisitorFormData>({
    visitorName: '',
    visitorEmail: '',
    phoneNumber: '',
    countryCode: '+254',
    purposeOfVisit: '',
    host: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.visitorName.trim()) {
      newErrors.visitorName = 'Visitor name is required';
    }

    if (!formData.visitorEmail.trim()) {
      newErrors.visitorEmail = 'Email is required';
    } else if (!validateEmail(formData.visitorEmail)) {
      newErrors.visitorEmail = 'Please enter a valid email address';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (formData.phoneNumber.length < 9) {
      newErrors.phoneNumber = 'Phone number must be at least 9 digits';
    }

    if (!formData.purposeOfVisit.trim()) {
      newErrors.purposeOfVisit = 'Purpose of visit is required';
    }

    if (!formData.host) {
      newErrors.host = 'Please select a host';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field: keyof VisitorFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const submitForm = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    setIsSubmitting(true);
    
    try {
      // Find the selected host
      const selectedHost = HOSTS.find(host => host.id === formData.host);
      
      if (!selectedHost) {
        throw new Error('Selected host not found');
      }

      // Generate email content
      const emailData = generateVisitorNotificationEmail(
        {
          visitorName: formData.visitorName,
          visitorEmail: formData.visitorEmail,
          phoneNumber: formData.phoneNumber,
          countryCode: formData.countryCode,
          purposeOfVisit: formData.purposeOfVisit,
        },
        selectedHost
      );
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      // You might want to show a user-friendly error message here
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

      // Send email notification
      const emailResult = await sendVisitorNotificationEmail(emailData);
      
      if (!emailResult.success) {
        throw new Error(emailResult.error || 'Failed to send notification email');
      }

      console.log('Email sent successfully:', emailResult.messageId);
  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    submitForm,
    validateForm
  };
};