import { DeloadStatus } from '@prisma/client';
import { CreateDeloadDto } from './create-deload.dto';
declare const UpdateDeloadDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateDeloadDto>>;
export declare class UpdateDeloadDto extends UpdateDeloadDto_base {
    status?: DeloadStatus;
}
export {};
