import { SetMetadata } from '@nestjs/common';

export const RequireRight = (right: string) => SetMetadata('right', right);
