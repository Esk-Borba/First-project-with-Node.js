import { container } from 'tsyringe';

import mailConfig from '@config/mail';
import IMailProvaider from './models/IMailProvaider';

import EtherealMailProvider from './implementations/EtherealMailProvider';
import SESMailProvider from './implementations/SESMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvaider>(
  'MailProvider',
  providers[mailConfig.driver],
);
