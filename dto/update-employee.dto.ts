import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { CreateAddressDto } from "./create-address.dto";
import { Type } from "class-transformer";

export class UpdateEmployeeDto {
  //   @IsNotEmpty()
  @IsOptional()
  @IsEmail()
  email: string;

  //   @IsNotEmpty()
  @IsOptional()
  @IsString()
  name: string;

  //   @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  age: number;

  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}
