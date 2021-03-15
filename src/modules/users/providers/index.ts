import { container } from 'tsyringe';

import IHashProvaider from './HashProvider/models/IHashProvaider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';

container.registerSingleton<IHashProvaider>('HashProvider', BCryptHashProvider);
