const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "ET_db",
});

connection.connect(function (err) {
  if (err) throw err;

  //it works!//
});

gorockets();

function gorockets() {
  // ]
  //  // alert("yes you can")
  // console.log("yes you can")
  console.log(" Company Tracker ");
  //omj

  inquirer
    .prompt({
      type: "list",
      message: "Select Option:",
      name: "selection",
      choices: ["View", "Add", "Update", "Im done"],
    })
    .then(function ({ selection }) {
      switch (selection) {
        case "Add":
          add();
          break;
        case "View":
          view();
          break;
        case "Update":
          update();
          break;
        case "Im done":
          connection.end();
          return;
      }
    });
}

//ADD OPTION//

function add() {
  inquirer
    .prompt({
      name: "db",
      message: "Where would you like to add?",
      type: "list",
      choices: ["department", "roles", "employees"],
    })
    .then(function ({ db }) {
      switch (db) {
        case "department":
          add_department();
          break;
        case "roles":
          add_role();
          break;
        case "employees":
          add_employee();
          break;
      }
    });
}

function add_department() {
  inquirer
    .prompt({
      name: "name",
      message: "What department are you adding to",
      type: "input",
    })
    .then(function ({ name }) {
      connection.query(
        `INSERT INTO department (name) VALUES ('${name}')`,
        function (err, data) {
          if (err) throw err;
          console.log(`Succesfully Added`);
          gorockets();
        }
      );
    });
}

function add_role() {
  let department = [];

  connection.query(`SELECT * FROM department`, function (err, data) {
    if (err) throw err;

    for (let i = 0; i < data.length; i++) {
      department.push(data[i].name);
    }

    inquirer
      .prompt([
        {
          name: "Position",
          message: "What is the role?",
          type: "input",
        },
        {
          name: "SALARY",
          message: "How much do they earn?",
          type: "input",
        },
        {
          name: "Department_id",
          message: "What department do they belong to?",
          type: "list",
          choices: department,
        },
      ])
      .then(function ({ Position, SALARY, Department_id }) {
        let index = department.indexOf(Department_id);

        connection.query(
          `INSERT INTO roles (Position, SALARY, Department_id) VALUES ('${Position}', '${SALARY}', ${index})`,
          function (err, data) {
            if (err) throw err;
            console.log(`Succesfully Added`);
            gorockets();
          }
        );
      });
  });
}

function add_employee() {
  let employees = [];
  let roles = [];

  connection.query(`SELECT * FROM roles`, function (err, data) {
    if (err) throw err;

    for (let i = 0; i < data.length; i++) {
      roles.push(data[i].title);
    }

    connection.query(`SELECT * FROM employees`, function (err, data) {
      if (err) throw err;

      for (let i = 0; i < data.length; i++) {
        employees.push(data[i].first_name);
      }

      inquirer
        .prompt([
          {
            name: "first_name",
            message: "Employees First Name",
            type: "input",
          },
          {
            name: "last_name",
            message: "Employees Last name?",
            type: "input",
          },
          {
            name: "role_id",
            message: "What is their role?",
            type: "list",
            choices: roles,
          },
          {
            name: "manager_id",
            message: "Who is their manager?",
            type: "list",
            choices: ["none"].concat(employees),
          },
        ])
        .then(function ({ first_name, last_name, role_id, manager_id }) {
          let queryText = `INSERT INTO employees (first_name, last_name, role_id`;
          if (manager_id != "none") {
            queryText += `, manager_id) VALUES ('${first_name}', '${last_name}', ${roles.indexOf(
              role_id
            )}, ${employees.indexOf(manager_id) + 1})`;
          } else {
            queryText += `) VALUES ('${first_name}', '${last_name}', ${
              roles.indexOf(role_id) + 1
            })`;
          }
          console.log(queryText);

          connection.query(queryText, function (err, data) {
            if (err) throw err;

            gorockets();
          });
        });
    });
  });
}

function view() {
  inquirer
    .prompt({
      name: "db",
      message: "Select an Option to view",
      type: "list",
      choices: ["department", "roles", "employees"],
    })
    .then(function ({ db }) {
      connection.query(`SELECT * FROM ${db}`, function (err, data) {
        if (err) throw err;

        console.table(data);
        gorockets();
      });
    });
}

function update() {
  inquirer
    .prompt({
      name: "update",
      message: "What are you updating?",
      type: "list",
      choices: ["role", "manager"],
    })
    .then(function ({ update }) {
      switch (update) {
        case "role":
          update_role();
          break;
        case "manager":
          update_manager();
          break;
      }
    });
}

function update_role() {
  connection.query(`SELECT * FROM employees`, function (err, data) {
    if (err) throw err;

    let employees = [];
    let roles = [];

    for (let i = 0; i < data.length; i++) {
      employees.push(data[i].First_name);
    }

    connection.query(`SELECT * FROM roles`, function (err, data) {
      if (err) throw err;

      for (let i = 0; i < data.length; i++) {
        roles.push(data[i].Position);
      }

      inquirer
        .prompt([
          {
            name: "employee_id",
            message: "Who's role will you update",
            type: "list",
            choices: employees,
          },
          {
            name: "role_id",
            message: "What is the new role?",
            type: "list",
            choices: roles,
          },
        ])
        .then(function ({ employee_id, role_id }) {
          //UPDATE `table_name` SET `column_name` = `new_value' [WHERE condition]
          connection.query(
            `UPDATE employees SET role_id = ${
              roles.indexOf(role_id) + 1
            } WHERE id = ${employees.indexOf(employee_id) + 1}`,
            function (err, data) {
              if (err) throw err;

              gorockets();
            }
          );
        });
    });
  });
}

function update_manager() {
  connection.query(`SELECT * FROM employees`, function (err, data) {
    if (err) throw err;

    let employees = [];

    for (let i = 0; i < data.length; i++) {
      employees.push(data[i].first_name);
    }

    inquirer
      .prompt([
        {
          name: "employee_id",
          message: "Who would you like to update?",
          type: "list",
          choices: employees,
        },
        {
          name: "manager_id",
          message: "Who's their new manager?",
          type: "list",
          choices: ["none"].concat(employees),
        },
      ])
      .then(({ employee_id, manager_id }) => {
        let queryText = "";
        if (manager_id !== "none") {
          queryText = `UPDATE employees SET manager_id = ${
            employees.indexOf(manager_id) + 1
          } WHERE id = ${employees.indexOf(employee_id) + 1}`;
        } else {
          queryText = `UPDATE employees SET manager_id = ${null} WHERE id = ${
            employees.indexOf(employee_id) + 1
          }`;
        }

        connection.query(queryText, function (err, data) {
          if (err) throw err;

          gorockets();
        });
      });
  });
}
