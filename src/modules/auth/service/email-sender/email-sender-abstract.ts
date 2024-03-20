/* eslint-disable @typescript-eslint/no-unused-vars */
export abstract class EmailSenderAbstract {
  public abstract sendMail(email: string, code: string): Promise<void>;
}
