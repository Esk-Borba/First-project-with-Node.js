import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    // quando a função date for chama, sera passado uma data ficticia
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    // cria um appointment, passando as infos necessárias
    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: '123456',
      user_id: '123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123456');
  });

  it('should not be able to create two appointments on the same time', async () => {
    // quando a função date for chama, sera passado uma data ficticia
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 10).getTime();
    });

    const appointmentDate = new Date(2020, 4, 10, 12);

    // cria um appointment, passando as infos necessarias
    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123456',
      user_id: '123123',
    });

    // cria um appointment, passando as infos necessárias, mas espera um erro
    // pois nao e possivel criar dois appointments no mesmo horario
    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '123456',
        user_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on past date', async () => {
    // quando a função date for chama, sera passado uma data ficticio
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    // espera que a resposta seja um erro, devido a hora de agendamento ser uma hora
    // anterior a atual
    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 10),
        provider_id: '123456',
        user_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    // quando a função date for chama, sera passado uma data ficticio
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    // espera que a resposta seja um erro, devido ao provider_id ser igual ao
    // user_id
    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 13),
        provider_id: '123123',
        user_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and afert 5pm', async () => {
    // quando a função date for chama, sera passado uma data ficticio
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    // espera que a resposta seja um erro, devido ao ser antes do horario de inicio
    // do atendimento
    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 7),
        provider_id: '123456',
        user_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 19),
        provider_id: '123456',
        user_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
