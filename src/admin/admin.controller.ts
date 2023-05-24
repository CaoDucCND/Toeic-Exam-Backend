import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Post('exam')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'excel', maxCount: 20 },
    { name: 'image', maxCount: 20 },
    { name: 'audio', maxCount: 20 },
  ],
    {
      storage: diskStorage({
        destination: path.join(__dirname, './../../uploads'),
        filename: (req, file, cb) => {
          // Define the filename logic here
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const originalname = file.originalname;
          const filename = `${uniqueSuffix}-${originalname}`;
          cb(null, filename);
        },
      }),
    }
  ))
  uploadFile(@UploadedFiles() files: { image?: Express.Multer.File[], audio?: Express.Multer.File[] }, @Body() body: any) {
    if (!files) {
      return {
        status: 404,
        message: 'No file uploaded',
      }
    }
    return this.adminService.uploadExam(body, files);
  }
}
