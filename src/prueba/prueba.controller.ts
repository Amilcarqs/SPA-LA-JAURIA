import { Controller, Post, Body, UseGuards, Param, Put } from '@nestjs/common';
import { AuditAction } from '../common/decorators/audit-action.decorators';
//import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Tu guard actual
import { RolesGuard } from '../auth/guards/roles.guard';     // Tu guard actual
import { Roles } from '../common/decorators/roles.decorator';

@Controller('pets')
@UseGuards(/* JwtAuthGuard,  */RolesGuard)
export class PetSpaController {

  @Post()
  @Roles('ADMIN', 'RECEPTIONIST')
  @AuditAction({ action: 'CREATE_PET_RECORD', entityType: 'PetSpa' })
  async createRecord(@Body() createDto: any) {
    return { id: '123-abc', status: 'created' };
  }

  @Put(':id')
  @Roles('ADMIN')
  @AuditAction({ action: 'UPDATE_PET_RECORD', entityType: 'PetSpa' })
  async updateRecord(@Param('id') id: string, @Body() updateDto: any) {
    return { id, status: 'updated' };
  }
}