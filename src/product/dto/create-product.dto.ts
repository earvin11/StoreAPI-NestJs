import { IsString, Min, IsNumber, MinLength, IsPositive, IsOptional, IsBoolean, IsMongoId } from 'class-validator';


export class CreateProductDto {

    @IsString()
    @MinLength(1)
    name: string;

    @IsNumber()
    @IsPositive()
    @Min(1)
    price: number;

    @IsMongoId()
    category: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsBoolean()
    available: boolean;

    @IsOptional()
    @IsString()
    img: string;
}
