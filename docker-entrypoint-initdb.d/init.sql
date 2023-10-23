CREATE DATABASE IF NOT EXISTS bosta2;

CREATE TABLE IF NOT EXISTS borrowers (
    id serial PRIMARY KEY,
    name varchar NOT NULL,
    email varchar NOT NULL,
    password varchar NOT NULL,
    last_login TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS books (
    id serial PRIMARY KEY,
    title varchar NOT NULL,
    author varchar NOT NULL,
    ISBN varchar UNIQUE NOT NULL,
    available_quantity INT NOT NULL CHECK (available_quantity >= 0),
    shelf_location varchar NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS borrower_check_book (
    id serial PRIMARY KEY,
    book_id INT NOT NULL,
    borrower_id INT NOT NULL,
    status INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (book_id) REFERENCES books (id),
    FOREIGN KEY (borrower_id) REFERENCES borrowers (id)
);

CREATE INDEX idx_borrowers ON borrower_check_book (borrower_id);




INSERT into borrowers(name, email, password)
Values
('Amr', 'amr@amr', 'amr')
('Amr1', 'amr@amr2', 'amr')
('Amr2', 'amr@amr3', 'amr')
('Amr4', 'amr@amr4', 'amr')
('Amr5132', 'amr@amr5', 'amr')
('Amr231', 'amr@amr66', 'amr')
('Amr321', 'amr@amr7', 'amr')
('Amr231', 'amr@amr8', 'amr')
('Amr312', 'amr@amr9', 'amr')
('Amr321', 'amr@amr10', 'amr')
('Amr312', 'amr@amr11', 'amr')
('Amr1235', 'amr@amr21', 'amr')
('Amr421', 'amr@amr214', 'amr')
('Amr1462', 'amr@amr12515', 'amr')
('Amr62131', 'amr@amr123', 'amr')
('Amr1234', 'amr@amr21312', 'amr')
('Amr124908', 'amr@amr123', 'amr');


INSERT into books (title, isbn, author, available_quantity, shelf_location) 
Values 
('Book1', '123231312131232521', 'asdasmdl', 10, 's20'),
('Book2', '123125121231224231231231251252112', 'asdasmdl', 10, 's20'),
('Book3', '1231521314124521231215512512', 'asdasmdl', 10, 's20'),
('Book4', '1234613115125153124141346136136312', 'asdasmdl', 10, 's20'),
('Book5', '123131245151511241241222151361112', 'asdasmdl', 10, 's20'),
('Book6', '126436511251512512211346312', 'asdasmdl', 10, 's20'),
('Book7', '1261666415215151241241231312', 'asdasmdl', 10, 's20'),
('Book8', '123125121231224231231231251252112', 'asdasmdl', 10, 's20'),
('Book9', '1231521314124521231215512512', 'asdasmdl', 10, 's20'),
('Book10', '1234613115125153124141346136136312', 'asdasmdl', 10, 's20'),
('Book11', '123131245151511241241222151361112', 'asdasmdl', 10, 's20'),
('Book12', '126436511251512512211346312', 'asdasmdl', 10, 's20'),
('Book13', '1261666415215151241241231312', 'asdasmdl', 10, 's20'),
('Book14', '12334613455151523511512512516134613612', 'asdasmdl', 10, 's20');


INSERT into borrower_check_book (book_id, borrower_id)
Values
(1,1),
(1,2),
(2,3),
(2,4),
(2,5),
(3,6),
(4,7),
(2,8),
(1,9);