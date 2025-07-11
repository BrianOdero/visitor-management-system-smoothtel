// Optimized email template generation
import { VisitorFormData } from '../types/visitor';
import { CompanyConfig } from '../config/company';

interface Host {
  id: string;
  name: string;
  title: string;
  email: string;
}

// Pre-compiled template functions for better performance
export const generateVisitorEmailTemplate = (
  formData: VisitorFormData, 
  companyConfig: CompanyConfig, 
  selectedHost: Host
) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, ${companyConfig.colors.primary}, ${companyConfig.colors.secondary}); padding: 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Visit Confirmation</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Your visit has been successfully registered</p>
      </div>
      
      <div style="padding: 20px;">
        <p style="color: #374151; font-size: 16px; margin-bottom: 15px;">
          Hi <strong style="color: ${companyConfig.colors.primary};">${formData.visitorName}</strong>,
        </p>
        
        <p style="color: #374151; font-size: 14px; margin-bottom: 20px;">
          Thank you for registering your visit to <strong>${companyConfig.name}</strong>. Your host has been notified.
        </p>
        
        <div style="background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 15px 0;">
          <h3 style="color: ${companyConfig.colors.primary}; margin: 0 0 10px 0; font-size: 16px;">📋 Visit Details</h3>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Host:</strong> ${selectedHost.name}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Purpose:</strong> ${formData.purposeOfVisit}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Contact:</strong> ${formData.countryCode}${formData.phoneNumber}</p>
        </div>
        
        <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 6px; padding: 10px; margin: 15px 0;">
          <p style="color: #92400e; margin: 0; font-size: 12px;">
            <strong>📍 Important:</strong> Please bring a valid ID for verification.
          </p>
        </div>
      </div>
      
      <div style="background-color: #f9fafb; padding: 15px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: #6b7280; margin: 0; font-size: 12px;">
          Best regards, <strong style="color: ${companyConfig.colors.primary};">${companyConfig.name} Team</strong>
        </p>
      </div>
    </div>
  `;
};

export const generateHostEmailTemplate = (
  formData: VisitorFormData, 
  companyConfig: CompanyConfig, 
  selectedHost: Host
) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, ${companyConfig.colors.primary}, ${companyConfig.colors.secondary}); padding: 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">New Visitor Registration</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">You have a new visitor scheduled</p>
      </div>
      
      <div style="padding: 20px;">
        <p style="color: #374151; font-size: 16px; margin-bottom: 15px;">
          Hi <strong style="color: ${companyConfig.colors.primary};">${selectedHost.name}</strong>,
        </p>
        
        <p style="color: #374151; font-size: 14px; margin-bottom: 20px;">
          You have received a new visitor registration.
        </p>
        
        <div style="background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 15px 0;">
          <h3 style="color: ${companyConfig.colors.primary}; margin: 0 0 10px 0; font-size: 16px;">👤 Visitor Information</h3>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Name:</strong> ${formData.visitorName}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Email:</strong> ${formData.visitorEmail}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Phone:</strong> ${formData.countryCode}${formData.phoneNumber}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Purpose:</strong> ${formData.purposeOfVisit}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Requested:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
      
      <div style="background-color: #f9fafb; padding: 15px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: #6b7280; margin: 0; font-size: 12px;">
          <strong style="color: ${companyConfig.colors.primary};">${companyConfig.name} Visitor Management System</strong>
        </p>
      </div>
    </div>
  `;
};

// Simple text templates for fallback
export const generateVisitorTextTemplate = (formData: VisitorFormData, hostName: string) => {
  return `Hi ${formData.visitorName}, your visit to see ${hostName} has been confirmed. Please bring a valid ID for verification.`;
};

export const generateHostTextTemplate = (formData: VisitorFormData) => {
  return `You have a new visitor: ${formData.visitorName} (${formData.visitorEmail}) scheduled to visit for: ${formData.purposeOfVisit}`;
};