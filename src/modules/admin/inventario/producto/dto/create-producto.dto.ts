import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDecimal, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateProductoDto {

    @ApiProperty()
    @IsString()
    @MaxLength(200)
    @IsNotEmpty()
    nombre:string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    descripcion?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    unidad_medida?: string;

    @ApiProperty()
    @IsString()
    @MaxLength(200)
    @IsOptional()
    marca?: string;

    @ApiProperty()
    @IsDecimal()
    precio_venta: number;

    @ApiProperty()
    @IsString()
    @MaxLength(255)
    @IsOptional()
    imagen?:string;

    @ApiProperty({type: 'boolean'})
    @IsBoolean()
    estado: boolean;

    @ApiProperty()
    @IsInt()
    categoria: number
    
}
