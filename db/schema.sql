CREATE TABLE department (
    id INTEGER UNSIGNED AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee_role (
    id INTEGER UNSIGNED AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER UNSIGNED,
    -- CONSTRAINT fk_department FOREIGN KEY (department_id) REFRENCESdepartment(id) ON DELETE SET NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INTEGER UNSIGNED AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    employee_role_id INTEGER UNSIGNED,
    manager_id INTEGER UNSIGNED,
    -- CONSTRAINT fk_employee_role FOREIGN KEY (employee_role_id) REFRENCES employee_role(id) ON DELETE SET NULL,
    -- CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFRENCES employee(id) ON DELETE SET NULL,
    PRIMARY KEY (id)
);