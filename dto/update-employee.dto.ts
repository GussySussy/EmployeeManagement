import {
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { CreateAddressDto } from "./create-address.dto";
import { Type } from "class-transformer";
import { EmployeeRole, Status } from "../entities/employee.entity";

export class UpdateEmployeeDto {
  //   @IsNotEmpty()
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  employeeId: string;

  @IsOptional()
  @IsNumber()
  experience: number;

  @IsOptional()
  @IsDateString()
  dateOfJoining: Date;

  @IsOptional()
  @IsEnum(Status)
  status: Status;

  //   @IsNotEmpty()
  @IsOptional()
  @IsString()
  name: string;

  //   @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  age: number;

  @IsOptional()
  @IsNumber()
  department: number;

  @IsOptional()
  @IsEnum(EmployeeRole)
  role: EmployeeRole;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}
