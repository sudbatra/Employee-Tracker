-- All Departments 
SELECT department.id, demartment_name AS department FROM department; 

-- All Roles
SELECT employee_role_id, title AS "Job Designation", department_name AS department, salary AS salary
FROM employee_role
INNER JOIN department
ON employee_role_id = department.id;

-- All Employees
SELECT employee.id, employee.first_name AS "First Name", employee.last_name AS "Last Name", title AS "Job Designation", department_name AS Department, salary AS Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager
FROM employee
INNER JOIN employee_role
    ON employee_role_id = employee_role.id
INNER JOIN department
    ON employee_role.department_id = department.id
LEFT JOIN employee manager
    ON manager.id = employee.manager_id; 