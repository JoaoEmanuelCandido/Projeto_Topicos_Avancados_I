import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class ClassificarChamadoDto {
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Length(10, 2000)
  texto: string;
}
