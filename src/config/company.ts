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
    email: string;
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
      title: 'Chief Executive Officer',
      email: 'raphael.mwangi@smoothtel.com'
    },
    {
      id: 'purity-mwende',
      name: 'Purity Mwende',
      title: 'Chief Operations Officer',
      email: 'purity.mwende@smoothtel.com'
    },
    {
      id: 'edward-koikai',
      name: 'Edward Koikai',
      title: 'Software Engineer',
      email: 'edward.koikai@smoothtel.com'
    },
    {
      id: 'joan-lusweti',
      name: 'Joan Lusweti',
      title: 'Sales Admin Team Lead',
      email: 'joan.lusweti@smoothtel.com'
    },
    {
      id: 'sarah-bosibori',
      name: 'Sarah Bosibori',
      title: 'Human Resource Officer',
      email: 'sarah.bosibori@smoothtel.com'
    },
     {
      id: 'brian-odero',
      name: 'Brian Odero',
      title: 'Software Engineering Assistant',
      email: 'odero7537@gmail.com'
    }
  ],
  contact: {
    email: "info@smoothtel.com",
    phone: "+254 700 000 000",
    address: "Nairobi, Kenya"
  }
};