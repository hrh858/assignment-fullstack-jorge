import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import {
  ActivityDataDto,
  DeleteActivityByIdDto,
  EmissionFactorDto,
  PostNewActivityDto,
} from './ZodSchemas';

@Injectable()
export class ClimatixService implements OnModuleInit {
  private readonly logger = new Logger(ClimatixService.name);

  // The simplified "database" of the activity that emits gasses
  private activityDb = new Map<string, ActivityDataDto>();

  // Simplified "database"
  private emissionFactorDb = new Map<string, EmissionFactorDto>();
  // private emissionFactorDb: { [activityType: string]: EmissionFactorDto } = {};

  constructor() {
    this.onModuleInit();
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('onModuleInit');

    await this.setEmissionFactor({
      activityType: 'gasoline',
      factors: {
        CO2: 69300,
        CH4: 3,
        N2O: 0.6,
      },
    });
    await this.setEmissionFactor({
      activityType: 'lng',
      factors: {
        CO2: 56100,
        CH4: 5,
      },
    });
    // There are more but for the purpose of assignment, these suffice
  }

  async setEmissionFactor(emissionFactor: EmissionFactorDto) {
    this.emissionFactorDb.set(emissionFactor.activityType, emissionFactor);
  }

  /**
   * Calculate emission and add to "database"
   * @param activityData
   */
  async addActivity(
    activityData: PostNewActivityDto,
  ): Promise<ActivityDataDto> {
    const emissions = await this.calculateEmission(
      activityData.activityType,
      activityData.amount,
    );
    const newActivityData: ActivityDataDto = {
      uuid: uuidv4(),
      activityType: activityData.activityType,
      amount: activityData.amount,
      activityDate: activityData.activityDate,
      emissions: emissions,
    };

    this.activityDb.set(newActivityData.uuid, newActivityData);

    return newActivityData;
  }

  async getAvailableActivityTypes(): Promise<string[]> {
    const activitieTypes: string[] = [];
    for (const actType of this.emissionFactorDb.keys()) {
      activitieTypes.push(actType);
    }
    return activitieTypes;
  }

  // TODO implement other methods as needed
  async getActivitiesByDate(date: string): Promise<ActivityDataDto[]> {
    const activitiesInDate: ActivityDataDto[] = [];
    for (const activityData of this.activityDb.values()) {
      if (activityData.activityDate === date)
        activitiesInDate.push(activityData);
    }
    return activitiesInDate;
  }

  async getActivityDataById(id: string): Promise<ActivityDataDto | undefined> {
    return this.activityDb.get(id);
  }

  async deleteActivityById(id: string): Promise<boolean> {
    return this.activityDb.delete(id);
  }

  /**
   * Calculates the emission
   * @param activityData
   * @returns
   */
  async calculateEmission(
    activityType: 'gasoline' | 'lng',
    amount: number,
  ): Promise<{ CO2: number; CH4: number; N2O: number }> {
    // TODO: Implement the emissions for each of the greenhouse gasses

    // The calculation method is:
    // Find the appropriate emission factor and multiply by the activity amount
    // E.g. activityData.emissions.[gas] = (EmissionFactor of activityData.activityType)  * activityData.amount
    const emissionFactorDtoObj = this.emissionFactorDb.get(activityType);
    if (!emissionFactorDtoObj)
      throw new HttpException(
        `The provided activity type '${activityType}' isn't supported`,
        HttpStatus.BAD_REQUEST,
      );
    const factors = emissionFactorDtoObj.factors;

    const CO2 = factors.CO2 * amount;
    const CH4 = factors.CH4 ?? 0 * amount;
    const N2O = factors.N2O ?? 0 * amount;

    return { CO2, CH4, N2O };
  }
}
