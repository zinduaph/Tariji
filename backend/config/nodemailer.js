import nodemailer from 'nodemailer';

// Explicit MailerSend SMTP configuration
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // use TLS via STARTTLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
    
});

// Helper function to send emails easily
export const sendEmail = async (to, subject, text, html = null) => {
    try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: to,
            subject: subject,
            text: text,
            html: html || text
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export default transporter;
