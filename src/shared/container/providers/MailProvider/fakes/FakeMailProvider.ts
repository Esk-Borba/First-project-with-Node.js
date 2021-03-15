import IMailProvider from '../models/IMailProvaider';

interface IMessage {
  to: string;
  body: string;
}

export default class FakeMailProvider implements IMailProvider {
  private message: IMessage[] = [];

  public async sendMail(to: string, body: string): Promise<void> {
    this.message.push({
      to,
      body,
    });
  }
}
