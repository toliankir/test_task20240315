import { Logger } from '@nestjs/common';
import { EmailSenderAbstract } from './email-sender-abstract';

export class EmailSenderFake extends EmailSenderAbstract {
  private readonly logger = new Logger(EmailSenderFake.name);

  public async sendMail(email: string, code: string): Promise<void> {
    this.logger.debug(`Send code "${code}" to email ${email}`);
  }
}
