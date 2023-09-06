import { IsNotEmpty } from 'class-validator';

export class AtualizarJogadorDto {
  @IsNotEmpty({ message: 'O Campo não pode ser vazio.' })
  readonly telefoneCelular: string;

  @IsNotEmpty({ message: 'O Campo não pode ser vazio.' })
  readonly nome: string;
}
