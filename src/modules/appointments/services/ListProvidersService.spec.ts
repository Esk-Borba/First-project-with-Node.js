import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Vinicius',
      email: 'vinicius@gmail.com',
      password: '123',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Vinicius2',
      email: 'vinicius2@gmail.com',
      password: '1235',
    });

    const logedUser = await fakeUsersRepository.create({
      name: 'Vinicius3',
      email: 'vinicius3@gmail.com',
      password: '1234',
    });

    const providers = await listProviders.execute({
      user_id: logedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
