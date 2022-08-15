import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as brcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService

  ){}

  async create(createUserDto: CreateUserDto) {

    try {
      const { password, ...userData } = createUserDto;

      const user =  this.userRepository.create({
        ...userData,
        password: brcrypt.hashSync(password,10)
      });

      await this.userRepository.save(user);
      delete user.password

      return {
        ...user,
        token: this.getJwt({ id: user.id })
      };
      
    } catch (error) {
      this.handleDbErrors(error);
    }

  }

  async loginUser(loginUserDto: LoginUserDto){

    const {password, email} = loginUserDto;

    const user = await this.userRepository.findOne({
      where: {email},
      select:{ email: true, password: true, id:true}
    })

    if(!user) throw new UnauthorizedException(`Credential invalid`);
    if(!brcrypt.compareSync(password, user.password)) throw new UnauthorizedException(`Credential invalid`);

    return {
      ...user,
      token: this.getJwt({ id: user.id })
    };

  }

  async checkAuthStatus( user: User ){
    return {
      ...user,
      token: this.getJwt({ id: user.id })
    };
  }

  private getJwt (payload: JwtPayload){
    const token = this.jwtService.sign( payload );
    return token;
  }

  private handleDbErrors (error):never{

    if(error.code === '23505')
      throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('Check server logs');
      
  }

  
}
