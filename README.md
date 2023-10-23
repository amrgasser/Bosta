### BOSTA TASK
- run ```npm install```
- run ```docker-compose up```
- run ```npm start```
------
This app uses a nodejs server with a postgresSQL database. Implemented rate limiter using IP address and stored in a redis cache and created a middleware for it to control TTL and max number of hits. Created a middleware for jwt authentication.

# Endpoints
- Books
  - ```GET: /books``` Get all books
  - ```GET: /books/{id}``` Get a specific book by id
  - ```POST: /books``` Create a new book
  - ```PUT /books/{id}``` Update a book
  - ```/books/search/{query}``` Search for a book by ISBN, Author or title
  - ```DELETE: /books/{id}``` Delete a book
- Borrowers
  - ```GET: /borrowers``` Get all borrowers
  - ```GET: /borrowers/{id}``` Get a specific borrower by id
  - ```POST: /borrowers``` Register a new borrower
  - ```PUT /borrowers/{id}``` Update a borrower
  - ```DELETE: /borrowers/authenticate``` To get JSON web token using email and password
- Books
  - ```GET: /check``` GET ALL BORROWING PROCESSES
  - ```POST: /books``` CHECK A BOOK USING borrower ID and book ID
  - ```PUT /books/{id}``` Update an entry. To mark as returned
  - ```GET: /books/book-statistics``` Export book statistics to xlxs
  - ```GET: /books/book-statistics``` Export book statistics to xlxs
  - ```GET: /books/borrowing-statistics``` Export borrowing statistics to xlxs
  - ```GET: /books/overdue-statistics``` Export overdue statistics to xlxs
  
  
  # DB Diagram
  ![DB DIAGRAM] (https://github.com/amrgasser/Bosta/blob/master/public/DB.png)


