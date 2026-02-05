import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class LoginAuthDto{

    @ApiProperty({description: 'Ingrese un correo válido', default: "admin@mail.com", example: "user@mail.com"})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @MinLength(6)
    @MaxLength(25)
    @IsNotEmpty()
    password: string; 
}