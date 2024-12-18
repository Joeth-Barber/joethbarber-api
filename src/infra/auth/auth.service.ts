import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "../email/email.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) {}

  generateMagicLinkToken(email: string, userId: string): string {
    const payload = { email, sub: userId };
    return this.jwtService.sign(payload, { expiresIn: "1h" });
  }

  async sendMagicLink(email: string, token: string): Promise<void> {
    // Passar o email como um parâmetro de consulta no magic link
    const magicLink = `http://localhost:5173/client/sessions/verify?token=${token}`;
    await this.mailService.sendMagicLink(email, magicLink);
  }

  verifyMagicLinkToken(token: string): { email: string } {
    try {
      return this.jwtService.verify<{ email: string }>(token);
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
