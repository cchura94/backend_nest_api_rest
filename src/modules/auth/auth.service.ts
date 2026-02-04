import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '../admin/users/users.service';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ){

    }

    async signIn(email: string, password: string): Promise<any>{

        // buscar user por email
        const usuario = await this.userService.findOneByEmail(email);
        if(!usuario){
            return new HttpException('Usuario no encontrado', 404);
        }

        const verificarPass = await compare(password, usuario.password);
        if(!verificarPass) throw new HttpException('Contraseña Incorrecta', 401);

        // JWT
        const payload = {
            username: usuario.username,
            id: usuario.id,
            roles: usuario.roles.map((r) => r.name) 
        }

        const token = this.jwtService.sign(payload);

        return {
            access_token: token,
            user: {
                username: usuario.username,
                email: usuario.email,
                roles: usuario.roles.map((r) => r.name) 
            }
        }

    }
}
