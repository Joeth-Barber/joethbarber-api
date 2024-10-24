import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "douglaswelber88@gmail.com",
      pass: "jjuc pcqi efiy wbpx",
    },
  });

  async sendMagicLink(email: string, magicLink: string) {
    const emailTemplate = `
      <div style="font-family: 'Outfit', Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 2px solid #525252; border-radius: 8px; background-color: #fff;">
        <img src="https://i.ibb.co/wWSSQbn/joeth-logo.png" alt="Joeth Barber Logo" style="display: block; margin: 0 auto;"/>
        <p style="font-size: 16px; color: #525252; text-align: center;">
          Clique <a href="${magicLink}" style="color: #007bff; text-decoration: none;">aqui</a> para acessar sua conta. O link é válido por 1 hora.
        </p>
        <p style="font-size: 14px; color: #525252; text-align: center; margin: 20px;">
          O redirecionamento não funcionou? Use este link: 
        </p>
        <div style="text-align: center;">
          <a href="${magicLink}" style="color: #007bff; text-decoration: none;">${magicLink.substring(
      0,
      120
    )}...</a>
        </div>
        <p style="font-size: 14px; color: #525252; text-align: center; display: block; margin-top: 20px;">
          Se você não solicitou este link, pode ignorar este e-mail.
        </p>
        <hr style="margin: 20px 0; border: 1px solid #525252;">
        <footer style="text-align: center; font-size: 12px;">
          <p style="color: #525252;">&copy; ${new Date().getFullYear()} Joeth Barber. Todos os direitos reservados.</p>
        </footer>
      </div>
    `;

    await this.transporter.sendMail({
      from: `"Joeth Barber" <douglaswelber88@gmail.com>`,
      to: email,
      subject: "Seu Magic Link de Login",
      html: emailTemplate,
    });
  }
}
