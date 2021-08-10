INSERT INTO department (department_name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO employee_role (title, salary, department_id)
VALUES
    ('Sales Lead', 10000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 150000, 1),
    ('Account Manager', 175000, 1),
    ('Accountant', 155000, 3),
    ('Lawyer', 190000, 4),
    ('Legal Team Lead', 250000, 4);

INSERT INTO employee (first_name, last_name, employee_role_id, manager_id)
VALUES
    ('Jassi', 'Sidhu', 1, null),
    ('Karan', 'Aujla', 2, 1), 
    ('Chunky', 'Pandey', 3, null),
    ('Jaskaran', 'Mann', 4, null),
    ('Gurpreet', 'Gill', 6, null),
    ('Nirvair', 'Pannu', 8, null),
    ('Jordan', 'Sandhu', 7, null);
