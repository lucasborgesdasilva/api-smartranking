import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CriarJogadorDto } from './dto/criar-jogador.dto';
import { AtualizarJogadorDto } from './dto/atualizar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadorPorId(_id: string): Promise<Jogador> {
    return await this.encontrarJogador(_id);
  }

  async criarJogador(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const { email } = criaJogadorDto;
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (jogadorEncontrado) {
      throw new BadRequestException(
        `Jogador com email ${email} já cadastrado.`,
      );
    }

    return await new this.jogadorModel(criaJogadorDto).save();
  }

  async atualizarJogador(
    _id: string,
    atualizarJogador: AtualizarJogadorDto,
  ): Promise<void> {
    await this.encontrarJogador(_id);
    await this.jogadorModel
      .findOneAndUpdate({ _id }, { $set: atualizarJogador })
      .exec();
  }

  async deletarJogador(_id: string): Promise<any> {
    await this.encontrarJogador(_id);
    return await this.jogadorModel.deleteOne({ _id }).exec();
  }

  private async encontrarJogador(_id: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com id ${_id} não encontrado.`);
    }

    return jogadorEncontrado;
  }
}
