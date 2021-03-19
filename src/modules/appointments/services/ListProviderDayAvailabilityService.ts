import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

// import User from '@modules/users/infra/typeorm/entities/User';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProvidersService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
    day,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        month,
        year,
        day,
      },
    );

    const hourStart = 8;

    // Cria um vertor de horas, preenchando os campos a partir das 8 horas da manha
    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );

    // Cria uma nova data
    const currentDate = new Date(Date.now());

    // verifica se os appointments cadastrados, retornando se esta available ou nao atraves da hora,
    // se ela esta disponivel ou nao
    const availability = eachHourArray.map(hour => {
      const hasApppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      // Cria uma data com base nos appointments
      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !hasApppointmentInHour && isAfter(compareDate, currentDate),
        // verifica se a hora do appointment vem depois da hora atual
      };
    });

    return availability;
  }
}

export default ListProvidersService;
