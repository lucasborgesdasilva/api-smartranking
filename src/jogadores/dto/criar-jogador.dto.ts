import { IsEmail, IsNotEmpty } from 'class-validator';

export class CriarJogadorDto {
  @IsNotEmpty({ message: 'O Campo não pode ser vazio.' })
  readonly telefoneCelular: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty({ message: 'O Campo não pode ser vazio.' })
  readonly nome: string;
}
