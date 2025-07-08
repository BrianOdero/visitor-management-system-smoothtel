import { useState, useRef } from 'react';
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
  const timeoutRef = useRef();

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
    
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const submitForm = async (): Promise<boolean> => {
    if (!validateForm()) return false;

    setIsSubmitting(true);
    const controller = new AbortController();

    try {
      const timeoutDuration = isSlowConnection ? 60000 : 30000;
      timeoutRef.current = setTimeout(() => controller.abort(), timeoutDuration) as any;

      const selectedHost = companyConfig.hosts.find(host => host.id === formData.host);
      const hostEmail = selectedHost?.email;
      const hostName = selectedHost?.name;

      const visitorEmailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, ${companyConfig.colors.primary}, ${companyConfig.colors.secondary}); padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
            <div style="background-color: #ffffff; padding: 15px; border-radius: 12px; display: inline-block; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <img src="${window.location.origin}${companyConfig.logo}" alt="${companyConfig.name} Logo" style="height: 60px; width: auto; object-fit: contain;" />
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Visit Confirmation</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your visit has been successfully registered</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hi <strong style="color: ${companyConfig.colors.primary};">${formData.visitorName}</strong>,
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Thank you for registering your visit to <strong>${companyConfig.name}</strong>. Your visit details have been confirmed and your host has been notified.
            </p>
            
            <div style="background: linear-gradient(135deg, #f8fafc, #e2e8f0); border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; margin: 25px 0;">
              <h3 style="color: ${companyConfig.colors.primary}; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; border-bottom: 2px solid ${companyConfig.colors.primary}; padding-bottom: 10px;">
                📋 Visit Details
              </h3>
              <div style="display: grid; gap: 12px;">
                <div style="display: flex; align-items: center; padding: 8px 0;">
                  <span style="color: #6b7280; font-weight: 500; min-width: 120px;">👤 Host:</span>
                  <span style="color: #374151; font-weight: 600;">${hostName}</span>
                </div>
                <div style="display: flex; align-items: center; padding: 8px 0;">
                  <span style="color: #6b7280; font-weight: 500; min-width: 120px;">💼 Title:</span>
                  <span style="color: #374151;">${selectedHost?.title}</span>
                </div>
                <div style="display: flex; align-items: center; padding: 8px 0;">
                  <span style="color: #6b7280; font-weight: 500; min-width: 120px;">📝 Purpose:</span>
                  <span style="color: #374151;">${formData.purposeOfVisit}</span>
                </div>
                <div style="display: flex; align-items: center; padding: 8px 0;">
                  <span style="color: #6b7280; font-weight: 500; min-width: 120px;">📞 Contact:</span>
                  <span style="color: #374151;">${formData.countryCode}${formData.phoneNumber}</span>
                </div>
                <div style="display: flex; align-items: center; padding: 8px 0;">
                  <span style="color: #6b7280; font-weight: 500; min-width: 120px;">📧 Email:</span>
                  <span style="color: #374151;">${formData.visitorEmail}</span>
                </div>
              </div>
            </div>
            
            
            <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin: 25px 0;">
              <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.5;">
                <strong>📍 Important:</strong> Please arrive 10 minutes before your scheduled time and bring a valid ID for security verification.
              </p>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-top: 25px;">
              We look forward to welcoming you to our office!
            </p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
              Best regards,<br/>
              <strong style="color: ${companyConfig.colors.primary};">${companyConfig.name} Team</strong>
            </p>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                ${companyConfig.contact.address} | ${companyConfig.contact.phone} | ${companyConfig.contact.email}
              </p>
              <p style="color: #9ca3af; font-size: 11px; margin: 5px 0 0 0;">
                This is an automated message from ${companyConfig.name} Visitor Management System
              </p>
            </div>
          </div>
        </div>
      `;

      const emailResponse = await fetch('https://vms-backend-86ch.onrender.com/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formData.visitorEmail,
          subject: 'Visit Confirmation',
          text: `Hi ${formData.visitorName}, your visit to see ${hostName} has been confirmed.`,
          html: visitorEmailHtml
        }),
        signal: controller.signal
      });

      if (hostEmail) {
        const hostEmailHtml = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <div style="background: linear-gradient(135deg, ${companyConfig.colors.primary}, ${companyConfig.colors.secondary}); padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
              <div style="background-color: #ffffff; padding: 15px; border-radius: 12px; display: inline-block; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <img src="${window.location.origin}${companyConfig.logo}" alt="${companyConfig.name} Logo" style="height: 60px; width: auto; object-fit: contain;" />
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">New Visitor Registration</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">You have a new visitor scheduled</p>
            </div>
            
            <div style="padding: 30px 20px;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Hi <strong style="color: ${companyConfig.colors.primary};">${hostName}</strong>,
              </p>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                You have received a new visitor registration. Please review the details below and take appropriate action.
              </p>
              
              <div style="background: linear-gradient(135deg, #f8fafc, #e2e8f0); border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; margin: 25px 0;">
                <h3 style="color: ${companyConfig.colors.primary}; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; border-bottom: 2px solid ${companyConfig.colors.primary}; padding-bottom: 10px;">
                  👤 Visitor Information
                </h3>
                <div style="display: grid; gap: 12px;">
                  <div style="display: flex; align-items: center; padding: 8px 0;">
                    <span style="color: #6b7280; font-weight: 500; min-width: 120px;">📝 Name:</span>
                    <span style="color: #374151; font-weight: 600;">${formData.visitorName}</span>
                  </div>
                  <div style="display: flex; align-items: center; padding: 8px 0;">
                    <span style="color: #6b7280; font-weight: 500; min-width: 120px;">📧 Email:</span>
                    <span style="color: #374151;">${formData.visitorEmail}</span>
                  </div>
                  <div style="display: flex; align-items: center; padding: 8px 0;">
                    <span style="color: #6b7280; font-weight: 500; min-width: 120px;">📞 Phone:</span>
                    <span style="color: #374151;">${formData.countryCode}${formData.phoneNumber}</span>
                  </div>
                  <div style="display: flex; align-items: center; padding: 8px 0;">
                    <span style="color: #6b7280; font-weight: 500; min-width: 120px;">💼 Purpose:</span>
                    <span style="color: #374151;">${formData.purposeOfVisit}</span>
                  </div>
                  <div style="display: flex; align-items: center; padding: 8px 0;">
                    <span style="color: #6b7280; font-weight: 500; min-width: 120px;">📅 Requested:</span>
                    <span style="color: #374151;">${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">Please review and respond to this visitor request:</p>
                <div style="display: inline-block;">
                  <a href="#" style="background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 0 8px; display: inline-block; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                    ✅ Approve Visit
                  </a>
                  <a href="#" style="background: linear-gradient(135deg, #ef4444, #dc2626); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 0 8px; display: inline-block; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">
                    ❌ Reject Visit
                  </a>
                </div>
              </div>
              
              <div style="background-color: #dbeafe; border: 1px solid #3b82f6; border-radius: 8px; padding: 15px; margin: 25px 0;">
                <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.5;">
                  <strong>💡 Reminder:</strong> Please respond to this visitor request promptly. The visitor will be notified of your decision automatically.
                </p>
              </div>
              
            </div>
            
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
                Best regards,<br/>
                <strong style="color: ${companyConfig.colors.primary};">${companyConfig.name} Visitor Management System</strong>
              </p>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  ${companyConfig.contact.address} | ${companyConfig.contact.phone} | ${companyConfig.contact.email}
                </p>
                <p style="color: #9ca3af; font-size: 11px; margin: 5px 0 0 0;">
                  This is an automated notification from ${companyConfig.name} Visitor Management System
                </p>
              </div>
            </div>
          </div>
        `;

        const hostNotificationResponse = await fetch('https://vms-backend-86ch.onrender.com/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: hostEmail,
            subject: `New Visitor Registration - ${formData.visitorName}`,
            text: `You have a new visitor: ${formData.visitorName} (${formData.visitorEmail}) scheduled to visit for: ${formData.purposeOfVisit}`,
            html: hostEmailHtml
          }),
          signal: controller.signal
        });
        
        if (!hostNotificationResponse.ok) {
          console.warn('Failed to send host notification email');
        }
      }

      if (!emailResponse.ok) throw new Error('Failed to send confirmation email');

      return true;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Request timed out');
      }
      console.error('Form submission error:', error);
      return false;
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
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