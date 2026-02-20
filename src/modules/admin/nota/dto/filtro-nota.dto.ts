import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsInt, IsOptional, IsString, Min } from "class-validator";

export class FiltroNotaDto{

    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    tipo_nota?: string; // compra | venta


    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    estado_nota?:string;

    @ApiProperty({required: false})
    @IsOptional()
    @IsDateString()
    desde?:string;

    @ApiProperty({required: false})
    @IsOptional()
    @IsDateString()
    hasta?:string;

    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    user_id?: string;

    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    cliente_id?: string;

    @ApiProperty({required: false})
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;


    @ApiProperty({required: false})
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

}