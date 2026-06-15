import { IsString, MaxLength, IsNotEmpty, MinLength } from 'class-validator';


export class LoginRequestDto {
  @IsString()
  @IsNotEmpty({message: "User name should be not empty"})
  @MinLength(3, {message: "User name should be longer that $constraint1."})
  @MaxLength(255, {message: "User name should be smoller that $constraint1."})
  username!: string;

  @IsString()
  @IsNotEmpty({message: "Password should be not empty"})
  @MinLength(3, {message: "Password should be longer that $constraint1."})
  @MaxLength(255, {message: "Password should be smoller that $constraint1."})
  password!: string;
}

export interface LoginResponseDto {
  message: string;
  token: string;
  expires_in: string;
}

export interface LogoutResponseDto {
  message: string;
}
