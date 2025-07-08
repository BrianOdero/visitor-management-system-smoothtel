export interface CompanyConfig {
  name: string;
  logo: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
  };
  hosts: Array<{
    id: string;
    name: string;
    title: string;
  }>;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
}

// Default configuration - easily customizable for any company
export const companyConfig: CompanyConfig = {
  name: "Smoothtel",
  logo: "/smoothtel_logo.png",
  colors: {
    primary: "#2563eb", // Blue-600
    secondary: "#f97316", // Orange-500
    accent: "#059669", // Emerald-600
    background: "#f8fafc", // Slate-50
    surface: "#ffffff", // White
  },
  hosts: [
    {
      id: 'raphael-mwangi',
      name: 'Raphael Mwangi',
      title: 'Chief Executive Officer'
    },
    {
      id: 'purity-mwende',
      name: 'Purity Mwende',
      title: 'Chief Operations Officer'
    },
    {
      id: 'edward-koikai',
      name: 'Edward Koikai',
      title: 'Software Engineer'
    },
    {
      id: 'joan-lusweti',
      name: 'Joan Lusweti',
      title: 'Sales Admin Team Lead'
    },
    {
      id: 'sarah-bosibori',
      name: 'Sarah Bosibori',
      title: 'Human Resource Officer'
    }
  ],
  contact: {
    email: "info@smoothtel.com",
    phone: "+254 700 000 000",
    address: "Nairobi, Kenya"
  }
};