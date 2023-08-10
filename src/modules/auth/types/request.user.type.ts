import { Request } from '@nestjs/common';

import { User } from '../../user/entity/user.entity';

export type RequestWithUser = Request & { user: User };
