import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthService } from '../service/auth.service';
import { RequestWithUser } from '../types/request.user.type';
import { AuthDto, SessionDto } from '../dto/auth.dto';
import { JwtAuthGuard } from '../guard/jwt.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: AuthDto })
  @ApiOkResponse({ type: SessionDto, description: 'User authenticated' })
  @ApiUnauthorizedResponse({ description: 'Wrong credentials' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: AuthDto) {
    const { username, password } = body;
    return this.authService.login(username, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOkResponse({ description: 'Profile user' })
  @ApiUnauthorizedResponse({ description: 'Wrong credentials' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async me(@Request() req: RequestWithUser) {
    console.log(req.user);
    return req.user;
  }
}
