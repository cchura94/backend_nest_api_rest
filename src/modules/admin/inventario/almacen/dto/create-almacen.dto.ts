import { IsInt, IsNotEmpty, IsOptional, IsString, maxLength, MaxLength } from "class-validator";

export class CreateAlmacenDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nombre: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    codigo?:string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsInt()
    sucursal: number;
}
