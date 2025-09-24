import nodemailer from "nodemailer";

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // For development, we'll use a test account
    // In production, you would use real SMTP credentials
    this.transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: "ethereal.user@ethereal.email",
        pass: "ethereal.pass",
      },
    });

    // Verify connection configuration
    this.transporter.verify((error, success) => {
      if (error) {
        console.log(
          "Email service not configured - emails will be logged to console instead"
        );
        console.log("Error:", error.message);
      } else {
        console.log("Email service ready to send emails");
      }
    });
  }

  async sendVerificationEmail(
    email: string,
    username: string,
    token: string
  ): Promise<void> {
    const verificationUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/verify-email?token=${token}`;

    const mailOptions = {
      from: '"Cuvinte Banatene" <noreply@cuvintebanatene.ro>',
      to: email,
      subject: "Verifică-ți adresa de email - Cuvinte Banatene",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5a4c2c;">Bună ziua, ${username}!</h2>
          <p>Mulțumim că te-ai înregistrat pe <strong>Cuvinte Banatene</strong>!</p>
          <p>Pentru a-ți activa contul și a putea adăuga cuvinte în dicționar, te rugăm să verifici adresa ta de email:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #5a4c2c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verifică Email-ul
            </a>
          </div>
          <p>Dacă butonul de mai sus nu funcționează, copiază și lipește următorul link în browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p>Dacă nu ai creat acest cont, te rugăm să ignori acest email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Acest email a fost trimis automat de către Cuvinte Banatene.<br>
            Dacă ai întrebări, te rugăm să ne contactezi.
          </p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Verification email sent:", info.messageId);
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.error("Error sending verification email:", error);
      // Log the email content to console for development
      console.log("=== EMAIL CONTENT (for development) ===");
      console.log("To:", email);
      console.log("Subject:", mailOptions.subject);
      console.log("Verification URL:", verificationUrl);
      console.log("=====================================");
      // Don't throw error - just log it for development
      console.log("Email sending failed, but registration will continue");
    }
  }

  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    const mailOptions = {
      from: '"Cuvinte Banatene" <noreply@cuvintebanatene.ro>',
      to: email,
      subject: "Bine ai venit la Cuvinte Banatene!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5a4c2c;">Bună ziua, ${username}!</h2>
          <p>Contul tău a fost verificat cu succes! Acum poți să:</p>
          <ul>
            <li>Adaugi cuvinte noi în dicționar</li>
            <li>Editezi cuvinte existente</li>
            <li>Colaborezi la dezvoltarea colecției de cuvinte banatene</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${
              process.env.FRONTEND_URL || "http://localhost:3000"
            }/admin" 
               style="background-color: #5a4c2c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Accesează Dicționarul
            </a>
          </div>
          <p>Mulțumim că contribui la păstrarea și promovarea limbii române din Banat!</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Acest email a fost trimis automat de către Cuvinte Banatene.
          </p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Welcome email sent:", info.messageId);
    } catch (error) {
      console.error("Error sending welcome email:", error);
      // Don't throw error for welcome email as it's not critical
    }
  }
}

export const emailService = new EmailService();
