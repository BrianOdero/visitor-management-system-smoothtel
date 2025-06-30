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
}