import { useState } from 'react';
import { VisitorFormData } from '../types/visitor';
import { useNetworkOptimization } from './useNetworkOptimization';
import { companyConfig } from '../config/company';

interface FormErrors {
  visitorName?: string;
  visitorEmail?: string;
  phoneNumber?: string;
  purposeOfVisit?: string;
  host?: string;
}

export const useVisitorForm = () => {
  const { isSlowConnection } = useNetworkOptimization();
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
    // Add timeout based on connection speed
    const timeoutDuration = isSlowConnection ? 30000 : 15000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

    // Find the selected host's details
    const selectedHost = companyConfig.hosts.find(host => host.id === formData.host);
    const hostEmail = selectedHost?.email;
    const hostName = selectedHost?.name;
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
    //   signal: controller.signal
    // });

    // if (!response.ok) throw new Error('Failed to submit form');

    // Step 2: Send confirmation email to visitor
    const emailResponse = await fetch('https://vms-backend-86ch.onrender.com/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: formData.visitorEmail,
        subject: 'Visit Confirmation',
        text: `Hi ${formData.visitorName}, your visit to see ${hostName} has been confirmed.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: ${companyConfig.colors.primary};">Visit Confirmation</h2>
            <p>Hi <strong>${formData.visitorName}</strong>,</p>
            <p>Your visit to <strong>${companyConfig.name}</strong> has been confirmed!</p>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: ${companyConfig.colors.primary};">Visit Details:</h3>
              <p><strong>Host:</strong> ${hostName} (${selectedHost?.title})</p>
              <p><strong>Purpose:</strong> ${formData.purposeOfVisit}</p>
              <p><strong>Contact:</strong> ${formData.countryCode}${formData.phoneNumber}</p>
            </div>
            <p>We look forward to seeing you!</p>
            <p>Best regards,<br/><strong>${companyConfig.name}</strong></p>
          </div>
        `,
      }),
      signal: controller.signal
    });

    // Step 3: Send notification email to host (if host email is available)
    if (hostEmail) {
      const hostNotificationResponse = await fetch('https://vms-backend-86ch.onrender.com/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: hostEmail,
          subject: `New Visitor Registration - ${formData.visitorName}`,
          text: `You have a new visitor: ${formData.visitorName} (${formData.visitorEmail}) scheduled to visit for: ${formData.purposeOfVisit}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: ${companyConfig.colors.primary};">New Visitor Registration</h2>
              <p>Hi <strong>${hostName}</strong>,</p>
              <p>You have a new visitor registration:</p>
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: ${companyConfig.colors.primary};">Visitor Details:</h3>
                <p><strong>Name:</strong> ${formData.visitorName}</p>
                <p><strong>Email:</strong> ${formData.visitorEmail}</p>
                <p><strong>Phone:</strong> ${formData.countryCode}${formData.phoneNumber}</p>
                <p><strong>Purpose of Visit:</strong> ${formData.purposeOfVisit}</p>
              </div>
              <p>Please prepare for their visit accordingly.</p>
              <p>Best regards,<br/><strong>${companyConfig.name} Visitor Management System</strong></p>
            </div>
          `,
        }),
        signal: controller.signal
      }),
      signal: controller.signal
    });
      
      // Note: We don't fail the entire process if host notification fails
      if (!hostNotificationResponse.ok) {
        console.warn('Failed to send host notification email');
      }
    }

    clearTimeout(timeoutId);

    if (!emailResponse.ok) throw new Error('Failed to send confirmation email');

    return true;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timed out');
    }
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