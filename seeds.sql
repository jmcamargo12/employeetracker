-- Employee Tracker


USE ET_db;

INSERT INTO Department
 (name)
VALUES
 ("Management");
INSERT INTO Department
 (name)
VALUES
 ("Crew");
INSERT INTO Department
 (name)
VALUES
 ("District Five");


INSERT INTO Employees
 (First_name, Last_name, Role_id, Manager_id)
VALUES
 ("Homer", "Simpson", 1 , 2);
INSERT INTO Employees
 (First_name, Last_name, Role_id, Manager_id)
VALUES
 ("Ned", "Flanders", 2, 3);
INSERT INTO Employees
 (First_name, Last_name, Role_id , Manager_id)
VALUES
 ("Barney", "Noles", 3, 4);


INSERT INTO Roles
 (Position, Salary , Department_id)
VALUES
 ("Nuclear Reactor", 40000, 1);
INSERT INTO Roles
 (Position, Salary , Department_id)
VALUES
 ("Bagel Shop", 70000, 2);
INSERT INTO Roles
 (Position, Salary , Department_id)
VALUES
 ("Security", 27000, 3);





