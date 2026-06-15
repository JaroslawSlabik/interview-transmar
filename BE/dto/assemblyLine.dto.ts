import { IsString, MaxLength, IsNotEmpty, IsBoolean, IsInt, Min, IsOptional } from 'class-validator';


export class AssemblyLineQueryDto {
  @IsOptional()
  @IsInt({message: "Identyfikatory powinny być liczbą."})
  @Min(1, {message: "Identyfikatory powinny być większe od 0."})
  productId?: bigint;
}

export class CreateAssemblyLineDto {
  @IsInt({message: "Identyfikatory powinny być liczbą."})
  @Min(1, {message: "Identyfikatory powinny być większe od 0."})
  product_id!: bigint;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255, {message: 'Name is too long. Maximal length is $constraint1 characters, but actual is $value'})
  name!: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateAssemblyLineDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, {message: 'Name is too long. Maximal length is $constraint1 characters, but actual is $value'})
  name!: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
