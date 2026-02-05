import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { jwtConstants } from './constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    // Authorization: Bearer TOKENJWT
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ')?? [];

    if(!token){
      throw new UnauthorizedException();
    }

    // type === 'Bearer'? token: undifined
    try {
      // verificar el token si es valido o no

      const payload = await this.jwtService.verifyAsync(token, { secret: jwtConstants.secret });
      request['user'] = payload;
      
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
