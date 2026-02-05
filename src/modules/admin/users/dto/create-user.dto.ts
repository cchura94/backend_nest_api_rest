import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        description: 'Nombre de usuario',
        minLength: 3,
        maxLength: 20,
        example: 'Juan Perez'
    })
    @IsString({message: 'El nombre de usuario debe ser una cadena de texto.'})
    @MinLength(3, {message: 'El nombre de usuario debe tener al menos 3 caracteres'})
    @MaxLength(20, {message: 'EL nombre de usuario no debe exceder los 20 caracteres'})
    username:string;

    @ApiProperty({
        description: 'Correo electronico del usuario',
        example: 'juan@mail.com'
    })
    @IsEmail({}, {message: 'El correo electrónico no tiene un formato válido'})
    email: string;

    @ApiProperty({
        description: 'Contraseña de usuario',
        minLength: 6,
        maxLength: 100,
        example: 'Juan Perez'
    })
    @IsString({message: 'La contraseña debe ser una cadena de texto.'})
    @MinLength(6, {message: 'La contraseña debe tener al menos 6 caracteres'})
    @MaxLength(100, {message: 'La contraseña no debe exceder los 100 caracteres'})
    password: string;

    @IsOptional()
    @IsArray({message: 'Los IDs de roles deben ser un arreglo'})
    @IsUUID('4', {each: true, message: 'Cada ID de rol debe ser un UUID válido (version 4)'})
    rolesIds?: string[];
}
