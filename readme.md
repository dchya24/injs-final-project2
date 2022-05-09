# INJS Final Project 1

PhotoAlbum Apps

Final Project 2 from Kampus Merdeka - Introduce to NodeJS  

For list API see [api list](./list_api.md)

URL apps [link](https://injs-finalproject1.herokuapp.com/)

## Installation

```bash
npm install
```

## Setup Project

### Setup environment

Copy file `.env.example` and rename to `.env`. You can seting config environment in `.env`

### Setup a database

  1. Create database and run migration
  2. Run the script

  ```bash
    npx sequelize db:create && npx sequelize migration:generate
  ```
  
  Or import database in `config/db.sql`

### Run Program

```bash
  npm run dev
```

### Testing Program

```bash
  npm test
```
