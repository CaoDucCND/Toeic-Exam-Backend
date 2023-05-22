import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Student } from '../entities/Student';
import { CreateUserDto } from './dto/createUser.dto';
@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<Student>,
  ) {}
  async findAll(): Promise<Student[]> {
    return this.userRepository.find();
  }
  async findOne(email: string): Promise<Student> {
    return this.userRepository.findOne({ where: { email } });
  }
  async create(createUserDto: CreateUserDto): Promise<Student> {
    // const email = createUserDto.email.toLowerCase();
    // const user = await this.userRepository.findOne({ where: { email } });
    // if (user) {
    //   throw new Error('Email already exists');
    // }
    const savedUser = await this.userRepository.save(createUserDto);
    return savedUser;
  }

  async findUserByEmail(email: string): Promise<Student> {
    console.log('check email', email);
    return await this.userRepository.findOne({ where: { email } });
  }

  async deleteUserByEmail(email: string): Promise<any> {
    return await this.userRepository.delete({ email });
  }
}
