import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import AbstractEntity from "./abstract.entity";
import Address from "./address.entity";
import { CreateAddressDto } from "../dto/create-address.dto";
import Department from "./department.entity";

export enum EmployeeRole {
  UI = "UI",
  UX = "UX",
  DEVELOPER = "DEVELOPER",
  HR = "HR",
}

@Entity()
class Employee extends AbstractEntity {
  constructor(
    email?: string,
    name?: string,
    age?: number,
    password?: string,
    address?: Address,
    department?: Department
  ) {
    super();
    if (email) this.email = email;
    if (name) this.name = name;
    if (age) this.age = age;
    if (password) this.password = password;
    this.address = address || new Address();
    if (department) this.department = department;
  }

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column({
    type: "enum",
    enum: EmployeeRole,
    default: EmployeeRole.DEVELOPER,
  })
  role: EmployeeRole;

  @OneToOne(() => Address, (address) => address.employee)
  address: Address;

  @Column()
  password: string;

  @ManyToOne(() => Department, (department) => department.employees)
  department: Department;
}

export default Employee;
