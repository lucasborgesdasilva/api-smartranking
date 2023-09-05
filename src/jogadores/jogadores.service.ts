import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dto/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];
  private readonly logger = new Logger(JogadoresService.name);

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return this.jogadores;
  }

  async consultarJogadorPorEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = this.jogadores.find(
      (jogador) => jogador.email === email,
    );

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com email: ${email} não encontrado`);
    }

    return jogadorEncontrado;
  }

  async criarAtualizarJogador(criaJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criaJogadorDto;

    const jogadorEncontrado = this.jogadores.find(
      (jogador: Jogador) => jogador.email === email,
    );

    if (jogadorEncontrado) {
      this.atualizar(jogadorEncontrado, criaJogadorDto);
    } else {
      this.criar(criaJogadorDto);
    }
  }

  private criar(criaJogadorDto: CriarJogadorDto): void {
    const { nome, telefoneCelular, email } = criaJogadorDto;

    const jogador: Jogador = {
      _id: uuidv4(),
      nome,
      telefoneCelular,
      email,
      ranking: 'A',
      posicaoRanking: 1,
      urlFotoJogador: 'www.google.com.br/foto123.jpg',
    };

    this.logger.log(`Jogador: ${JSON.stringify(jogador, null, 2)}`);
    this.jogadores.push(jogador);
  }

  private atualizar(
    jogadorEncontrado: Jogador,
    criaJogadorDto: CriarJogadorDto,
  ) {
    const { nome } = criaJogadorDto;

    jogadorEncontrado.nome = nome;
  }

  async deletarJogador(email: string): Promise<void> {
    const jogadorEncontrado = this.jogadores.find(
      (jogador) => jogador.email === email,
    );

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com email: ${email} não encontrado`);
    }

    this.jogadores = this.jogadores.filter(
      (jogador) => jogador.email !== jogadorEncontrado.email,
    );
  }
}
