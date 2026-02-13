import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsDecimal, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateNotaDto {
    @ApiProperty()
    @IsDateString()
    fecha: string;

    @ApiProperty()
    @IsString()
    tipo_nota: string;
    
    @ApiProperty()
    @IsNumber()
    cliente_id: number;

    @ApiProperty()
    @IsString()
    @IsUUID('4', {each: true})
    user_id: string;

    @ApiProperty()
    @IsString()
    estado_nota: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    observaciones?: string;

    @ApiProperty()
    @IsArray()
    movimientos: MovimientoDto[]
}

class MovimientoDto {
    @ApiProperty()
    @IsNumber()
    producto_id: number;

    @ApiProperty()
    @IsNumber()
    almacen_id: number;

    @ApiProperty()
    @IsNumber()
    cantidad: number;

    @ApiProperty()
    @IsString()
    tipo_movimiento: 'ingreso' | 'salida' | 'devolucion'
    
    @ApiProperty()
    @IsDecimal()
    precio_unitario_compra: number;
    
    @ApiProperty()
    @IsDecimal()
    precio_unitario_venta: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    observaciones?: string;
}