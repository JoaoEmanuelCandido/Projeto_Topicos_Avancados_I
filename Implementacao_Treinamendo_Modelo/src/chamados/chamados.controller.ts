import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { ClassificarChamadoDto } from './dto/classificar-chamado.dto';
import { AnalisarInformacoesAusentesDto } from './dto/analisar-informacoes-ausentes.dto';
import { ChamadosService } from './chamados.service';

@Controller('chamados')
export class ChamadosController {
  constructor(private readonly chamados: ChamadosService) { }

  @Post('classificar')
  classificar(@Body() dto: ClassificarChamadoDto) {
    return this.chamados.classificar(dto.texto);
  }

  @Post('informacoes-ausentes')
  @HttpCode(200)
  identificarInformacoesAusentes(
    @Body() dto: AnalisarInformacoesAusentesDto,
  ) {
    return this.chamados.identificarInformacoesAusentes(dto.texto);
  }
}