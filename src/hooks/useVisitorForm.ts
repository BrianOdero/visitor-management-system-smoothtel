import { useState } from 'react';
import { VisitorFormData } from '../types/visitor';

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
  if (!validateForm()) return false;

  setIsSubmitting(true);

  try {
    // Step 1: Submit visitor data (e.g., to DB or NestJS)
    // const response = await fetch('/api/visitors', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     ...formData,
    //     fullPhoneNumber: `${formData.countryCode}${formData.phoneNumber}`
    //   }),
    // });

    // if (!response.ok) throw new Error('Failed to submit form');

    // Step 2: Send confirmation email
    const emailResponse = await fetch('https://vms-backend-86ch.onrender.com/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: formData.visitorEmail,
        subject: 'Visit Confirmation',
        text: `Hi ${formData.visitorName}, your visit has been confirmed.`,
        html: `<p>Hi <strong>${formData.visitorName}</strong>,</p><p>Your visit to see ${formData.host} has been confirmed. We look forward to seeing you!</p>`,
      }),
    });

    if (!emailResponse.ok) throw new Error('Failed to send confirmation email');

    return true;
  } catch (error) {
    console.error('Form submission error:', error);
    return false;
  } finally {
    setIsSubmitting(false);
  }
};


  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    submitForm,
    validateForm
  };
};