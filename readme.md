# INJS Final Project 1

PhotoAlbum Apps

Final Project 2 from Kampus Merdeka - Introduce to NodeJS  

URL apps [link](https://injs-finalproject2.herokuapp.com/)

## Installation

```bash
npm install
```

## Setup Project

### Setup environment

Copy file `.env.example` and rename to `.env`. You can seting config environment in `.env`

### Setup a database

- Create database and run migration
- Run the script

```bash
  npm run db:create && npm run db:generate
```

- Generate Seeders

``` bash
    npm run db:seed
```

### Run Program

Run with nodemon

```bash
  npm run dev
```

Run with node

```bash
  npm start
```

### Testing Program

```bash
  npm run test
```
