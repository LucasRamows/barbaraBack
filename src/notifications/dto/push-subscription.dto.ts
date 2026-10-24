import { IsInt, IsOptional, IsString, IsUrl, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PushKeysDto {
  @IsString()
  p256dh!: string;

  @IsString()
  auth!: string;
}

export class PushSubscriptionDto {
  @IsUrl({ require_tld: false })
  endpoint!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  expirationTime!: number | null;

  @ValidateNested()
  @Type(() => PushKeysDto)
  keys!: PushKeysDto;
}
