import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class ExerciseOrderItem {
  @IsString() id: string;
  @IsInt() @Min(0) order: number;
}

export class ReorderExercisesDto {
  @ApiProperty({ type: [ExerciseOrderItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseOrderItem)
  items: ExerciseOrderItem[];
}
