import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export enum Section {
  read = 'read',
  think = 'think',
  act = 'act'
}

export class CreatePostDto {
  @IsEnum(Section)
  section!: Section;

  @IsString()
  @MinLength(1)
  title!: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  body!: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  coverUrl?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class UpdatePostDto extends CreatePostDto {}
