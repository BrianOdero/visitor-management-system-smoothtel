# Universal Visitor Management System Template

A beautiful, production-ready visitor registration system that can be easily customized for any company. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Universal Template**: Easily customizable for any company
- **Dynamic Theming**: Automatically adapts colors to match your brand
- **Responsive Design**: Works perfectly on all devices
- **Production Ready**: Optimized for performance and user experience
- **Modern UI**: Beautiful, professional interface with smooth animations
- **Form Validation**: Comprehensive validation with real-time feedback
- **Progress Tracking**: Visual progress indicator for form completion
- **Network Optimization**: Handles slow connections gracefully
- **Email Integration**: Automatic confirmation emails
- **Dashboard**: Admin dashboard for managing visitor records

## 🎨 Customization

### Quick Setup for Your Company

1. **Update Company Configuration** (`src/config/company.ts`):
```typescript
export const companyConfig: CompanyConfig = {
  name: "Your Company Name",
  logo: "/your_logo.png",
  colors: {
    primary: "#your-primary-color",
    secondary: "#your-secondary-color",
    accent: "#your-accent-color",
    background: "#f8fafc",
    surface: "#ffffff",
  },
  hosts: [
    {
      id: 'host-1',
      name: 'John Doe',
      title: 'CEO',
      email: 'john.doe@yourcompany.com'
    },
    // Add your team members
  ],
  contact: {
    email: "info@yourcompany.com",
    phone: "+1 234 567 8900",
    address: "Your Address"
  }
};
```

2. **Replace Logo**: Add your company logo as `/public/your_logo.png`

3. **Update Colors**: The system automatically generates color variants based on your primary and secondary colors

4. **Customize Hosts**: Update the hosts array with your team members

### Color System

The template uses a dynamic color system that automatically generates:
- Primary color variants (50, 100, 200, 300, 400, 500, 600, 700, 800, 900)
- Secondary color variants
- Accent colors for success states
- Automatic contrast adjustments

### Available CSS Classes

- `bg-brand-primary` - Primary background color
- `bg-brand-secondary` - Secondary background color
- `bg-brand-gradient` - Primary to secondary gradient
- `text-brand-primary` - Primary text color
- `border-brand-primary` - Primary border color
- `bg-brand-primary-50` to `bg-brand-primary-900` - Primary color variants

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📱 Responsive Design

The template is fully responsive with:
- Mobile-first design approach
- Optimized layouts for all screen sizes
- Touch-friendly interactions
- Progressive enhancement

## 🔧 Technical Features

- **TypeScript**: Full type safety
- **React 18**: Latest React features
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tool
- **React Router**: Client-side routing
- **React Hook Form**: Form management
- **Lucide React**: Beautiful icons
- **Performance Optimized**: Code splitting, lazy loading, image optimization

## 🎯 Use Cases

Perfect for:
- Corporate offices
- Co-working spaces
- Government buildings
- Healthcare facilities
- Educational institutions
- Event venues
- Any organization requiring visitor management

## 📄 License

This template is free to use for any purpose. Customize it for your company and deploy it anywhere.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Made with ❤️ for companies worldwide**