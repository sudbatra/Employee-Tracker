const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const PORT = process.env.PORT || 4002; 
const app = express(); 

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Wrangler16%',
    database: 'employee_db'    
})

connection.connect(err => {
    if (err) throw err; 
    console.log('connected as id' + connection.threadId + '\n');
    initiateApp();
});

const initiateApp = () => {

    const questions = () => {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'menu',
                message: 'Select actions from below:',
                choices: [
                    'View all Departments',
                    'View all Roles',
                    'View all Employees',
                    'Add a Department',
                    'Add a Role',
                    'Add an Employee',
                    'Update an Employee Role',
                    'Quit',
                ],
            }
        ])

            .then(answers => {
                if (answers.menu === 'View all Departments'){
                    displayDepartments(); 
                }
                if (answers.menu === 'View all Roles'){
                    displayRoles(); 
                }
                if (answers.menu === 'View all Employees'){
                    console.log('This works');
                    displayEmployees(); 
                }
                if (answers.menu === 'Add a Department'){
                    addDepartment(); 
                }
                if (answers.menu === 'Add a Role'){
                    addRole(); 
                }
                if (answers.menu === 'Add an Employee'){
                    addEmployee(); 
                }
                if (answers.menu === 'Update an Employee'){
                    addEmployee(); 
                }
                if (answers.menu === 'Quit'){
                    console.log('Thank you for using Employee Tracker...')
                    return false;  
                }
            })

    };

    displayDepartments = () => {
        const query = `SELECT department.id, department_name AS Department FROM department`;
            connection.query(query, function (err, res){
                if (err) throw err;
                console.log('\n _______All Departments_______\n');
                console.table(res);
                questions();
                return true; 
            }
        );
    };

    displayRoles = () => {
        connection.query(`SELECT employee_role.id, title AS "Job Designation", department_name AS Department, salary As Salary FROM employee_role INNER JOIN department ON employee_role.department_id = department.id`, 
            function (err, res) {
                if (err) throw err;
                console.log('\n _______All Roles_______\n');
                console.table(res);
                questions();
                return true; 
            }
        );
    };

 

    displayEmployees = () => {
        const query = `SELECT employee.id, employee.first_name AS "First Name", employee.last_name AS "Last Name", employee_role.title AS "Job Designation", employee_role.salary AS Salary FROM employee
        INNER JOIN employee_role
            ON employee.id = employee_role.id
        INNER JOIN department
            ON employee_role.department_id = department.id 
        LEFT JOIN employee manager
            ON manager.id = employee.manager_id`
       connection.query(query,
            function (err, res){
                if (err) throw err;
                console.log('\n _______All Employees_______\n');
                console.table(res);
                questions();
                return true; 
            }
        );
    };


    addDepartment = () => {
        return inquirer.prompt ([
            {
                type: 'input',
                name: 'department_name', 
                message: 'Enter the name of the Department that you want to add.',
                validate: checkInput => {
                    if (checkInput) {
                        return true; 
                    }
                    else{
                        console.log('Incorrect format. Enter the Department name correctly.');
                        return false; 
                    }
                }
            }
        ])

            .then(answers => {
                console.log(answers);
                console.log('\n_______Adding the new Department_______\n');
                const query = connection.query(
                    `INSERT INTO department SET ?`, answers,
                    function (err, res){
                        if (err) throw err; 
                        console.log(res.affectedRows);
                    });
                console.log('Department has been added!');
                
                displayDepartments(); 
                return true;
    
            })        
    };


    addRole = () => {
        let choicesDepartments = []; 

        connection.query(
            `SELECT id AS value, department_name AS Department FROM department`, 
            function (err, res){
                if (err) throw (err);
                for (let i=0; i<res.length; i++){
                    const department = res[i];
                    choicesDepartments.push({
                        name: department.department, 
                        value: department.value
                    });
                }
                promptRole(choicesDepartments)
            }
        );
    } 

    promptRole = (choicesDepartments) => {

        return inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is designation of this new role? ',
                validate: checkInput => {
                    if (checkInput){
                        return true; 
                    }
                    else{
                        console.log('Incorrect format. Enter the Role name correctly.');
                        return false; 
                    }
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is salary of this new role?',
                validate: checkInput => {
                    if (checkInput){
                        return true; 
                    }
                    else{
                        console.log('Incorrect format. Enter the salary correctly.');
                        return false; 
                    }
                }
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'What department is this new role assigned to? ',
                choices: choicesDepartments,
            }
        ])

        .then(answers => {
            console.log(answers);
            console.log('\n_______Adding the new Role_______\n');
            const query = connection.query(
                `INSERT INTO employee_role SET ?`, answers,
                function (err, res){
                    if (err) throw err; 
                    console.log(res.affectedRows);
                });
            console.log('Role has been added!');
            displayRoles(); 
            return true;

        })        
    };


    addEmployee = () => {
        let choicesRoles = []; 
        let choicesManager = [];

        connection.query(
            `SELECT id AS value, title AS Role FROM employee_role`,
            function (err, res) {
                if (err) throw (err);
                for (let i=0; i<res.length; i++){
                    const roles = res[i];
                    choicesRoles.push({
                        name: roles.Role, 
                        value: roles.value
                    });
                }
            }
        );

        connection.query(
            `SELECT employee.id AS value, CONCAT(employee.first_name, ' ', employee.last_name) AS Manager FROM employee;`,
            function (err, res) {
                if (err) throw err; 
                for (let i=0; i<res.length; i++){
                    const roles = res[i];
                    choicesManager.push({
                        name: roles.Manager, 
                        value: roles.value
                    });
                }

                employeePrompt(choicesRoles, choicesManager)
            }
        );
    }

    employeePrompt = (choicesRoles, choicesManager) => {

        return inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'What is the first name of the employee? ',
                validate: checkInput => {
                    if (checkInput){
                        return true; 
                    }
                    else{
                        console.log('Incorrect format. Enter the First Name of the employee correctly.');
                        return false; 
                    }
                }
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'What is the last name of the employee? ',
                validate: checkInput => {
                    if (checkInput){
                        return true; 
                    }
                    else{
                        console.log('Incorrect format. Enter the Last Name of the employee correctly.');
                        return false; 
                    }
                }
            },
            {
                type: 'list',
                name: 'employee_role_id',
                message: 'What is the role assigned to this new Employee?',
                choices: choicesRoles,
            },
            {
                type: 'list',
                name: 'manager_id',
                message: 'What department is this new role assigned to? ',
                choices: choicesManager,
            }
        ])

        .then(answers => {
            console.log(answers);
            console.log('\n_______Adding the new Employee_______\n');
            const query = connection.query(
                `INSERT INTO employee SET ?`, answers,
                function (err, res){
                    if (err) throw err; 
                    console.log(res.affectedRows);
                });
            console.log('New Employee has been added!');
            displayEmployees(); 
            return true;
        })        
    };

    updateRole = () => {
        let choicesRoles = [];
        let choicesEmployee = [];

        connection.query(
            `SELECT id AS value, title AS Role FROM employee_role`,
            function (err, res) {
                if (err) throw err; 
                for (let i=0; e<res.length; i++){
                    const roles = res[i];
                    choicesRoles.push({
                        name: roles.Role, 
                        value: roles.value
                    });
                }
            }
        );

        connection.query(
            `SELECT employee.id AS value, CONCAT(employee.first_name, ' ', employee.last_name) AS Manager FROM employee;`,
            function (err, res) {
                if (err) throw err; 
                for (let i=0; i<res.length; i++){
                    const roles = res[i];
                    choicesEmployee.push({
                        name: roles.Manager, 
                        value: roles.value
                    });
                }

                updateRolePrompt(choicesEmployee, choicesRoles)
            }
        );
    }

    updateRolePrompt = (choicesEmployee, choicesRoles) => {
        return inquirer.prompt([
            {
                type: 'list', 
                name: 'id', 
                message: 'Select an Employee to modify Role',
                choices: choicesEmployee,
            },
            {
                type: 'list',
                name: 'employee_role_id',
                message: 'What is the New Role that is being assigned to this employee?',
                choices: choicesRoles,
            }
        ])

            .then(answers => {
                console.log(answers);
                console.log('\n_______Updating the Employee_______\n');
                const query = connection.query(
                `UPDATE employee SET ? WHERE ?`, [
                    {
                        employee_role_id: answers.employee_role_id
                    },
                    {
                        id: answers.id,
                    }
                ],
                    function (err, res){
                        if (err) throw err; 
                        console.log(res.affectedRows);
                    });

                console.log('Employee has been updated!');
                displayEmployees(); 
                return true;
            })
    }

    questions ()
};

app.listen(PORT, () => {
    console.log(`Server is now live on ${PORT}`);
});