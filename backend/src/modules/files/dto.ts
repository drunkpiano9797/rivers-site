import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFileDto {
  @IsString()
  name!: string;

  @IsNumber()
  size!: number;

  @IsString()
  mime!: string;

  @IsString()
  checksum!: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean = false;
}
