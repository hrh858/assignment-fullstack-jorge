import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const PossibleActivityTypes = ['gasoline', 'lng'] as const;

const GetActivityByIdSchema = z.object({
  id: z.string().uuid(),
});

const DeleteActivityByIdSchema = GetActivityByIdSchema;

const GetActivitiesByDateSchema = z.object({
  date: z.dateString().format('date').past(),
});

const PostNewActivitySchema = z.object({
  amount: z.number().min(0),
  activityType: z.enum(PossibleActivityTypes),
  activityDate: z.dateString().format('date').past(),
});
const ActivityDataSchema = PostNewActivitySchema.extend({
  uuid: z.string().uuid(),
  emissions: z.object({
    CO2: z.number().nonnegative(),
    CH4: z.number().nonnegative().optional(),
    N2O: z.number().nonnegative().optional(),
  }),
});

const EmissionFactorSchema = z.object({
  activityType: z.enum(PossibleActivityTypes),
  factors: z.object({
    CO2: z.number().nonnegative(),
    CH4: z.number().nonnegative().optional(),
    N2O: z.number().nonnegative().optional(),
  }),
});

export class GetActivityByIdDto extends createZodDto(GetActivityByIdSchema) {}
export class DeleteActivityByIdDto extends createZodDto(
  DeleteActivityByIdSchema,
) {}
export class GetActivitiesByDateDto extends createZodDto(
  GetActivitiesByDateSchema,
) {}
export class PostNewActivityDto extends createZodDto(PostNewActivitySchema) {}
export class ActivityDataDto extends createZodDto(ActivityDataSchema) {}
export class EmissionFactorDto extends createZodDto(EmissionFactorSchema) {}
