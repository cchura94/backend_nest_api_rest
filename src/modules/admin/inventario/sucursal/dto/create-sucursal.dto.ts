import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateSucursalDto {

    @ApiProperty({example: "Sucursal centro", description: 'Nombre de la sucursal', maxLength: 100})
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nombre: string;

    @ApiProperty({example: 'Av. Principal 123'})
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    direccion: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    ciudad: string;
}

