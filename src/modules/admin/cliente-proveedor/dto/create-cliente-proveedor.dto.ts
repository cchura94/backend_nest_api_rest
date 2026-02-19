import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateClienteProveedorDto {
    @ApiProperty()
    @IsString()
    tipo: "cliente" | "proveedor";

    @ApiProperty()
    @IsString()
    razon_social: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    identificacion: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    telefono: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    direccion: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    correo: string;

    @ApiProperty()
    @IsBoolean()
    estado: boolean
}
