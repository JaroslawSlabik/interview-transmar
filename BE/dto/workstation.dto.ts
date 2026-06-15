import { IsString, MaxLength, IsNotEmpty } from 'class-validator';


export class CreateWorkstationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, {message: 'Short name is too long. Maximal length is $constraint1 characters, but actual is $value'})
  short_name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255, {message: 'Name is too long. Maximal length is $constraint1 characters, but actual is $value'})
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100, {message: 'PC name is too long. Maximal length is $constraint1 characters, but actual is $value'})
  pc_name!: string;
}
