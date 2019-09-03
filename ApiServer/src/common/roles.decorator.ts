import { SetMetadata } from '@nestjs/common';

export const Roles = (minumumRole: number) => SetMetadata('minumumRole', minumumRole);