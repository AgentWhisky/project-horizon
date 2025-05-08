import { SetMetadata } from '@nestjs/common';

export const REQUIRE_RIGHTS_KEY = 'rights';

export const RequireRight = (...rights: string[]) => SetMetadata(REQUIRE_RIGHTS_KEY, rights);
