import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import {
  MODELO_PROVIDER,
  ModeloProvider,
} from '../ia/providers/modelo.provider';
import { ChamadoCategoria } from './chamado-categoria';
import { ClassificarChamadoDto } from './dto/classificar-chamado.dto';

@Injectable()
export class ChamadosService {
  constructor(
    @Inject(MODELO_PROVIDER)
    private readonly modeloProvider: ModeloProvider,
  ) { }

  async classificar(dto: ClassificarChamadoDto) {
    const prompt = `

Classifique o seguinte chamado em APENAS UMA das categorias permitidas: 

    ACESSO;
    FINANCEIRO; 
    MATRICULA;
    DOCUMENTOS;
    OUTROS.

Não forneça NENHUMA explicação adicional, não use aspas ou pontos finais. Apenas o nome exato da categoria.

ATENÇÃO A GRAFIA: Coloque a resposta exatamente da forma dessas palvras, sem mudar nem uma letra.

Texto do chamado: "${dto.texto}"`;

    const resultado = await this.modeloProvider.gerar({ mensagem: prompt });

    // Normalizar a resposta removendo espaços e caracteres indevidos.
    const categoriaRecebida = resultado.resposta
      .toUpperCase()
      .trim()
      .replace(/[^A-Z]/g, '');

    const categoriasValidas = Object.values(ChamadoCategoria) as string[];

    if (!categoriasValidas.includes(categoriaRecebida)) {
      throw new BadGatewayException('O modelo retornou uma categoria inválida');
    }

    return {
      texto: dto.texto,
      categoria: categoriaRecebida,
      modelo: resultado.modelo,
    };
  }
}
