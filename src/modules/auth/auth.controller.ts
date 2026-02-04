import { Body, Controller, Post } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post("/login")
    funLogin(@Body() datos: LoginAuthDto){
        return this.authService.signIn(datos.email, datos.password);
    }
}
