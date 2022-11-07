import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// import { ActivityDataDto } from './ActivityData.dto';
import { ClimatixService } from './Climatix.service';
import {
  ActivityDataDto,
  DeleteActivityByIdDto,
  GetActivitiesByDateDto,
  GetActivityByIdDto,
  PostNewActivityDto,
} from './ZodSchemas';

@Controller('climatix')
@ApiTags('climatix')
export class ClimatixController {
  private readonly logger = new Logger(ClimatixController.name);
  private readonly climatixService = new ClimatixService();

  @Post('/activities')
  async addActivity(
    @Body() data: PostNewActivityDto,
  ): Promise<ActivityDataDto> {
    // TODO implement the actual logic
    const addedActivityData = await this.climatixService.addActivity(data);
    return addedActivityData;
  }

  // TODO: Implement endpoint to get all activityData of given date
  @Get('/activities')
  async getActivitiesInDate(
    @Query() data: GetActivitiesByDateDto,
  ): Promise<ActivityDataDto[]> {
    const { date } = data;
    const activities = this.climatixService.getActivitiesByDate(date);
    return activities;
  }

  // TODO: Implement endpoint to get activityData given UID
  @Get('/activities/:id')
  async getActivity(
    @Param() data: GetActivityByIdDto,
  ): Promise<ActivityDataDto> {
    const activityData = await this.climatixService.getActivityDataById(
      data.id,
    );
    if (!activityData) {
      throw new HttpException(
        `No activity has been found for the provided id: ${data.id}`,
        HttpStatus.NO_CONTENT,
      );
    }
    return activityData;
  }

  @Delete('/activities/:id')
  async deleteActivity(@Param() data: DeleteActivityByIdDto) {
    const wasFoundAndDeleted = this.climatixService.deleteActivityById(data.id);
    if (!wasFoundAndDeleted) {
      throw new HttpException(
        `No activity has been found for the provided id: ${data.id}`,
        HttpStatus.NO_CONTENT,
      );
    }
  }

  @Get('activityTypes')
  async getAvailableActivityTypes() {
    return this.climatixService.getAvailableActivityTypes();
  }
}
