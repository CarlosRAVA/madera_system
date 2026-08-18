import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BusinessConfigService } from './business-config.service';
import { UpdateBusinessConfigDto } from './dto/update-business-config.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('business-config')
@Controller('api/business-config')
export class BusinessConfigController {
  constructor(private readonly businessConfigService: BusinessConfigService) {}

  /**
   * GET /api/business-config — información pública del negocio (RF6)
   * Incluye "isOpenNow", resultado de combinar el switch manual del admin
   * con el horario configurado (ver BusinessConfigService.computeIsOpenNow).
   */
  @Get()
  @ApiOperation({
    summary:
      'Obtener configuración del negocio y si está abierto ahora (público)',
  })
  @ApiResponse({ status: 200, description: 'Configuración del negocio' })
  getConfig() {
    return this.businessConfigService.getConfig();
  }

  /**
   * PUT /api/business-config — actualiza la configuración (solo ADMIN)
   */
  @Put()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar configuración del negocio (solo ADMIN)',
  })
  @ApiResponse({ status: 200, description: 'Configuración actualizada' })
  update(@Body() dto: UpdateBusinessConfigDto) {
    return this.businessConfigService.update(dto);
  }
}
