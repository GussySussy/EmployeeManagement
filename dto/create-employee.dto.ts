import {
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
  ValidateNested,
} from "class-validator";
import { CreateAddressDto } from "./create-address.dto";
import { Type } from "class-transformer";
import { EmployeeRole, Status } from "../entities/employee.entity";
import { CreateDepartmentDto } from "./create-department.dto";

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @IsNotEmpty()
  @IsNumber()
  experience: number;

  @IsNotEmpty()
  @IsDateString()
  dateOfJoining: Date;

  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password: string;

  @IsEnum(EmployeeRole)
  role: EmployeeRole;

  @IsNumber()
  department: number;

  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}
