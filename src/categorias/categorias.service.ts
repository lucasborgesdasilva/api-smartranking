import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categoria } from './interfaces/categoria.interface';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';
import { AtualizarCategoriaDto } from './dto/atualizar-categoria.dto';
import { JogadoresService } from 'src/jogadores/jogadores.service';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadoresService: JogadoresService,
  ) {}

  async consultarTodasCategorias(): Promise<Array<Categoria>> {
    return await this.categoriaModel.find().populate('jogadores').exec();
  }

  async consultarCategoriaPorId(_id: string): Promise<Categoria> {
    return await this.encontrarCategoria(_id);
  }

  async criarCategoria(
    criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria> {
    const { categoria } = criarCategoriaDto;

    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (categoriaEncontrada) {
      throw new BadRequestException(`Categoria ${categoria} já cadastrada!`);
    }

    return await new this.categoriaModel(criarCategoriaDto).save();
  }

  async atualizarCategoria(
    _id: string,
    atualizarCategoria: AtualizarCategoriaDto,
  ): Promise<void> {
    await this.encontrarCategoria(_id);
    await this.categoriaModel
      .findOneAndUpdate({ _id }, { $set: atualizarCategoria })
      .exec();
  }

  async atribuirCategoriaJogador(params: string[]): Promise<void> {
    const categoria = params['categoria'];
    const jogadorId = params['jogadorId'];

    await this.jogadoresService.consultarJogadorPorId(jogadorId);

    const jogadorJaCadastrado = await this.categoriaModel
      .find({ categoria })
      .where('jogadores')
      .in(jogadorId);

    if (jogadorJaCadastrado) {
      throw new BadRequestException(
        `Jogador ${jogadorId} já cadastrado na categoria.`,
      );
    }

    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria ${categoria} não encontrada.`);
    }

    categoriaEncontrada.jogadores.push(jogadorId);

    await this.categoriaModel
      .findOneAndUpdate({ categoria }, { $set: categoriaEncontrada })
      .exec();
  }

  private async encontrarCategoria(_id: string): Promise<Categoria> {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ _id })
      .exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria com id ${_id} não encontrado.`);
    }

    return categoriaEncontrada;
  }
}
