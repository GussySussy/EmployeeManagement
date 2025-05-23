import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import AbstractEntity from "./abstract.entity";
import Address from "./address.entity";
import { CreateAddressDto } from "../dto/create-address.dto";
import Employee from "./employee.entity";


@Entity()
class Department extends AbstractEntity {
  constructor(dept_name?:string){
    super()
    if(dept_name) this.name = dept_name
  }

  @Column({unique: true})
  name: string;

  @OneToMany(() => Employee, (employee)=>employee.department, {cascade: true})
  employees: Employee[]
}

export default Department;
