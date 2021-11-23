# _Sora API_

**An open source Anime and Manga API.**


## Project Setup

- Prereqs: In order to start the api, you will need a MySQL driver installed on your machine, a database instance set up, and Node.js installed on your machine. For more information see the prereqs section.
- Clone this repository and cd into it

```bash
    git clone https://github.com/jakuzo/sora-api.git
    cd sora-api
```

- Install dependencies
```bash
    npm install
```

- Run the api in development mode
```bash
    npm run dev
```

If all goes well you should see something that looks like:
```bash
Attempting to establish connection with database
sora api running on port 3000
# followed by some sql queries
```

To verify your api is working correctly, open a browser window and navigate to: http://localhost:3000/v1 or open an API platform application such as Postman and navigate to this endpoint.

## Prereqs
### Databse Configuration
- Install MySQL driver https://www.mysql.com/
- Install MySQL Workbench https://dev.mysql.com/doc/workbench/en/ (optional)
- Using MySQL Workbench or MySQL shell:
    - Create a new database instance called sora
    - Create Media table that looks like:
    - Table Name: media with columns:
        - id: INT, PK, NN, AI
        - title: VARCHAR(255), NN
        - year: INT, NN
        - type: VARCHAR(255), NN
    - Note, once migrations are setup, this will be automated
- Seed the database
```bash
    cd sora-api
    npm run seed
```

Moreover, if your database instance has a different name, or set a different user or password, ensure you update the settings in ormconfig.json

### VSCode Setup
- TODO


### POSTMAN
- TODO




