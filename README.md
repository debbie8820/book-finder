# Book-finder

:point_right:[Live Demo]](https://bookfinder-express.herokuapp.com/)

This is a price comparison website for books built with Node.js and express.js.

<img alt="homepage" src="https://github.com/debbie8820/book-finder/blob/main/public/img/homepage.jpg">

The below are the scraped websites:
<ol>
<li>博客來 https://www.books.com.tw/</li>
<li>蝦皮書城  https://shopee.tw/m/best-selling-books</li>
<li>城邦讀書花園 https://www.cite.com.tw/ </li>
</ol>

### :fire:Features
<img alt="homepage" src="https://github.com/debbie8820/book-finder/blob/main/public/img/search.jpg">
+ Authenticate users
+ Search and filter books
+ Favorite items

### Environments
* [Node.js (14.16.1)](https://nodejs.org/en/)
* [Express (4.17.1)](https://expressjs.com/zh-tw/)

## Getting Started
1. Clone this repo to your desktop
```
$ git clone https://github.com/debbie8820/expense-tracker.git
```

2. Open the root directory and install all dependencies
```
$ npm install
```

3. Set up database (Please make sure you have installed MySQL locally)
```
create database book_finder
```

4. Set up environment variables
create an .env file and set the environment variables (check .env.example for reference)
```
//The below "to" and "from" are email addresses. When database is updated, you'll receive an email.
to=SKIP 
from=SKIP
```

5. Set up seed files
```
npm run seed
```

6. Execute
```
npm run start
```

7. When the app starts running, the terminal will send the following message:
```
Example app listening on port 3000
```

8. Now you can see the result on localhost 3000
```
http://localhost:3000/
```

9. You can use the following data to login
```
email: user1@example.com
password: 12345678
```

### Author
Debbie Chang
