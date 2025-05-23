import express from "express";
import Employee from "./entities/employee.entity";
import { datasource } from "./db/data-source";
import { Entity } from "typeorm";

const employeeRouter = express.Router();

const employeeRepository = datasource.getRepository(Employee);

// let count = 2;
// let employees: Employee[] = [
//   {
//     id: 1,
//     email: "employee1@gmail.com",
//     name: "Employee1",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: 2,
//     email: "employee2@gmail.com",
//     name: "Employee2",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
// ];

// employeeRouter.get("/:id", (req, res) => {
//   const empId = Number(req.params["id"]);
//   const employee = employees.find((emp) => emp.id === empId);
//   if (!employee) {
//     res.status(404).send("Employee not found");
//     return;
//   }
//   res.status(200).send(employee);
// });

// employeeRouter.post("/", (req, res) => {
//   console.log(req.body);
//   const newEmployee = new Employee();
//   newEmployee.email = req.body.email;
//   newEmployee.name = req.body.name;
//   newEmployee.createdAt = new Date();
//   newEmployee.updatedAt = new Date();
//   newEmployee.id = ++count;
//   employees.push(newEmployee);
//   res.status(200).send(newEmployee);
// });

// employeeRouter.delete("/:id", (req, res) => {
//   const employeeIdxToDelete = employees.findIndex(
//     (emp) => emp.id === Number(req.params["id"]),
//   );
//   employees.splice(employeeIdxToDelete, 1);
//   res.status(200).send();
// });

// employeeRouter.put("/:id", (req, res) => {
//   const employee = employees.find((emp) => emp.id === Number(req.params["id"]));
//   employee.email = req.body.email;
//   employee.name = req.body.name;
//   employee.updatedAt = new Date();
//   console.log("update employees");
//   res.status(200).send(employee);
// });

employeeRouter.get("/", async (req, res) => {
  const employees = await employeeRepository.find();
  console.log(employees);
  res.status(200).send(employees);
});

employeeRouter.get("/:id", async (req, res) => {
  const empId = Number(req.params["id"]);
  const employee = await employeeRepository.findOneBy({ id: empId });
  res.status(200).send(employee);
});

employeeRouter.post("/", async (req, res) => {
  const data = req.body;
  const newEmployee = new Employee();
  newEmployee.name = data.name;
  newEmployee.email = data.email;
  employeeRepository.save(newEmployee);
  res.status(201).send(newEmployee);
});

employeeRouter.put("/:id", async (req, res) => {
  const empid = Number(req.params["id"]);
  const data = req.body;
  const update = await employeeRepository.update(empid, { name: data.name, email: data.email });
  res
    .status(201)
    .send({
      message: "Entry Updated Successfully.",
      updatedEntry: update,
    });
});

employeeRouter.delete("/:id", async (req, res) => {
  const empId = Number(req.params["id"])
  await employeeRepository.delete(empId)
  res.status(200).send("Row Deleted Successfully");
});

export default employeeRouter;
