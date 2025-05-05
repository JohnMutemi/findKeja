import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInquiryNotification({
  to,
  propertyTitle,
  inquiry,
}: {
  to: string;
  propertyTitle: string;
  inquiry: {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
}) {
  try {
    await resend.emails.send({
      from: 'FindKeja <notifications@findkeja.com>',
      to,
      subject: `New Inquiry for ${propertyTitle}`,
      html: `
        <h1>New Property Inquiry</h1>
        <p>You have received a new inquiry for your property: <strong>${propertyTitle}</strong></p>
        
        <h2>Inquiry Details:</h2>
        <ul>
          <li><strong>Name:</strong> ${inquiry.name}</li>
          <li><strong>Email:</strong> ${inquiry.email}</li>
          <li><strong>Phone:</strong> ${inquiry.phone}</li>
          <li><strong>Message:</strong> ${inquiry.message}</li>
        </ul>
        
        <p>Please respond to this inquiry as soon as possible.</p>
        
        <p>Best regards,<br>The FindKeja Team</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send email notification:', error);
  }
} 