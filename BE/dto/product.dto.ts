import { IsString, MaxLength, IsNotEmpty } from 'class-validator';


export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, {message: 'Name is too long. Maximal length is $constraint1 characters, but actual is $value'})
  name!: string;
}
