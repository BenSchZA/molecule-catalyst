import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreatorApplicationDto {
  @IsString()
  public readonly firstName: string;
  @IsString()
  public readonly lastName: string;
  @IsEmail()
  public readonly email: string;
  @IsString()
  public readonly biography: string;
  @IsString()
  public readonly professionalTitle: string;
  @IsString()
  public readonly affiliatedOrganisation: string;
}
