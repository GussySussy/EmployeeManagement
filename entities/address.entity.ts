import { Column, Entity, JoinColumn, OneToOne} from "typeorm";
import AbstractEntity from "./abstract.entity";
import Employee from "./employee.entity";

@Entity()
class Address extends AbstractEntity {
  //   @Column()
  //   country: string;

  //   @Column()
  //   city: string;
  @OneToOne(() => Employee, (employee) => employee.address,{
    onDelete: "CASCADE"
  })
  @JoinColumn()
  employee: Employee

  @Column()
  pincode: string;

  @Column()
  line1: string;

}

export default Address;
