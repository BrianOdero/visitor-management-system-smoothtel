import { EmailData, VisitorRegistrationResponse } from '../types/visitor';

// Dynamically determine the protocol to match the frontend
const getEmailApiUrl = () => {
  const protocol = window.location.protocol;
  return `${protocol}//localhost:5000/api/send-email`;
};

export const sendVisitorNotificationEmail = async (emailData: EmailData): Promise<VisitorRegistrationResponse> => {
  try {
    const response = await fetch(getEmailApiUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Email service error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
};

export const generateVisitorNotificationEmail = (
  visitorData: {
    visitorName: string;
    visitorEmail: string;
    phoneNumber: string;
    countryCode: string;
    purposeOfVisit: string;
  },
  hostData: {
    name: string;
    title: string;
    email: string;
  }
): EmailData => {
  const fullPhoneNumber = `${visitorData.countryCode}${visitorData.phoneNumber}`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const subject = `New Visitor Registration - ${visitorData.visitorName}`;
  
  const text = `
Dear ${hostData.name},

You have a new visitor registration for today, ${currentDate} at ${currentTime}.

Visitor Details:
- Name: ${visitorData.visitorName}
- Email: ${visitorData.visitorEmail}
- Phone: ${fullPhoneNumber}
- Purpose of Visit: ${visitorData.purposeOfVisit}

Please prepare for their arrival and ensure they are properly welcomed.

Best regards,
Smoothtel Visitor Management System
  `.trim();

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Visitor Registration</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #3b82f6, #f97316);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
        }
        .visitor-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .visitor-detail {
          display: flex;
          margin-bottom: 12px;
          align-items: center;
        }
        .visitor-detail strong {
          min-width: 120px;
          color: #1e40af;
          font-weight: 600;
        }
        .purpose-box {
          background: #eff6ff;
          border-left: 4px solid #3b82f6;
          padding: 15px;
          margin: 15px 0;
          border-radius: 0 8px 8px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 14px;
        }
        .timestamp {
          background: #fef3c7;
          border: 1px solid #fbbf24;
          border-radius: 6px;
          padding: 10px;
          margin: 15px 0;
          text-align: center;
          font-weight: 600;
          color: #92400e;
        }
        .logo {
          text-align: center;
          margin-bottom: 20px;
        }
        .action-required {
          background: #fee2e2;
          border: 1px solid #fca5a5;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          color: #991b1b;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <h2 style="color: #3b82f6; margin: 0;">🏢 Smoothtel</h2>
          <p style="margin: 5px 0 0 0; color: #64748b;">Visitor Management System</p>
        </div>
        
        <div class="header">
          <h1>🔔 New Visitor Registration</h1>
        </div>

        <p style="font-size: 16px; margin-bottom: 20px;">
          Dear <strong>${hostData.name}</strong>,
        </p>

        <p>You have a new visitor registration that requires your attention.</p>

        <div class="timestamp">
          📅 Registration Time: ${currentDate} at ${currentTime}
        </div>

        <div class="visitor-card">
          <h3 style="margin-top: 0; color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
            👤 Visitor Information
          </h3>
          
          <div class="visitor-detail">
            <strong>👤 Name:</strong>
            <span>${visitorData.visitorName}</span>
          </div>
          
          <div class="visitor-detail">
            <strong>📧 Email:</strong>
            <span><a href="mailto:${visitorData.visitorEmail}" style="color: #3b82f6; text-decoration: none;">${visitorData.visitorEmail}</a></span>
          </div>
          
          <div class="visitor-detail">
            <strong>📱 Phone:</strong>
            <span><a href="tel:${fullPhoneNumber}" style="color: #3b82f6; text-decoration: none;">${fullPhoneNumber}</a></span>
          </div>
        </div>

        <div class="purpose-box">
          <h4 style="margin-top: 0; color: #1e40af;">🎯 Purpose of Visit:</h4>
          <p style="margin-bottom: 0; font-size: 16px;">${visitorData.purposeOfVisit}</p>
        </div>

        <div class="action-required">
          ⚠️ <strong>Action Required:</strong> Please prepare for the visitor's arrival and ensure they receive proper assistance.
        </div>

        <div class="footer">
          <p><strong>Best regards,</strong><br>
          Smoothtel Visitor Management System</p>
          <p style="font-size: 12px; color: #9ca3af;">
            This is an automated notification. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    to: hostData.email,
    subject,
    text,
    html
  };
};