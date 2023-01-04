import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';


export class PaginationDto {

    @IsOptional()
    @IsNumber()
    @IsInt()
    @Min(1)
    limit?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    skip?: number;
}