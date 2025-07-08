export interface VisitorFormData {
  visitorName: string;
  visitorEmail: string;
  phoneNumber: string;
  countryCode: string;
  purposeOfVisit: string;
  host: string;
}

export interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

export interface Host {
  id: string;
  name: string;
  title: string;
  email: string;
}

export interface EmailData {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface VisitorRegistrationResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}