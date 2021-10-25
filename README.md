# Book-finder

:point_right: [Live Demo](https://bookfinder-express.herokuapp.com/)

This is a price comparison website for books built with Node.js and express.js.

<img alt="homepage" src="https://github.com/debbie8820/book-finder/blob/master/public/img/demo3.gif">

The below are the scraped websites:
<ol>
<li>博客來 https://www.books.com.tw/</li>
<li>蝦皮書城  https://shopee.tw/m/best-selling-books</li>
<li>城邦讀書花園 https://www.cite.com.tw/ </li>
</ol>

### :fire: Features
<img alt="search" src="https://github.com/debbie8820/book-finder/blob/master/public/img/demo4.gif">

+ Authenticate users
+ Search and filter books
+ Favorite items


### Environments
* [Node.js (14.16.1)](https://nodejs.org/en/)
* [Express (4.17.1)](https://expressjs.com/zh-tw/)


### Getting Started
1. Clone this repo to your desktop
```
$ git clone https://github.com/debbie8820/book-finder.git
```


2. Open the root directory and install all dependencies
```
$ npm install
```


3. Set up database (Please make sure you have installed MySQL locally)
```
create database book_finder
```


4. Set up environment variables</br>
create an .env file and set the environment variables
```
//The below are email addresses for you to set up. When database is updated, you'll receive an email.

nodemailer_send_to=SKIP 
nodemailer_send_from=SKIP
```


5. Set up seed files
```
npm run seed
```


6. Execute
```
npm run start
```


7. When the app starts running, the terminal will send:
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