import {

  IsOptional,
  IsString,
} from "class-validator";

export class UpdateDepartmentDto {
  //   @IsNotEmpty()
  @IsOptional()
  @IsString()
  name: string;
}
