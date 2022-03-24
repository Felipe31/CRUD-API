# CRUD backend to handle companies, units, assets and users

### Rules
- Each asset must have an image, name, description, model, owner, status and health level;
- Each asset is part of a unit;
- Each unit is part of a company;
- Every user is part of a company;
- There are three types of status: Running, Alerting, Stopped;
- Health level needs to be between 0% to 100%.


This application is currently available [here](https://tractianapi.herokuapp.com/) for testing.

### Running

```sh
$ npm install
$ npm start
```

### Testing

The `tests` folders hold all automated testing using jest.
The `npm test` command tests all available endpoints.

## API

### Organization

The objects presented are organized as follows.

Note that every registry has an ID and a timestamp of creation. Both are created automatically by mongodb
```json
"created": timestamp, // created automatically
"_id": id, // created automatically
```

All fields starting with `fk` followed by another type name (e.g. `fkUnit`) should be filled with its name, not its id.

#### Asset
```json
{
"name": "Asset name",
"image": "Image reference",
"description": "Description",
"model": "Model id",
"owner": "Owner name",
"status": "Running",
"health": 100 ,
"fkUnit": "Unit 1",
}
```

#### Company
```json
  "name": "Company 1"
```

#### Unit
```json
  "name": "Unit 1"
  "fkCompany": "Company 1"
```

#### User
```json
  "name": "User 1"
  "fkCompany": "Company 1"
```
### Endpoints
There are endpoints availables for assets, companies, units and users as follows.

##### Assets endpoints:
```
POST /assets
PUT /assets
DELETE /assets
GET /assets
```

##### Companies endpoints:
```
POST /companies
PUT /companies
DELETE /companies
GET /companies
GET /companies/{fkCompany}
GET /companies/{fkCompany}/assets
```
* e.g. localhost/companies/MyCompany

##### Units endpoints:
```
POST /units
PUT /units
DELETE /units
GET /units
```

##### Users endpoints:
```
POST /users
PUT /users
DELETE /users
GET /users
```

#### Updating data
Note that for `PUT` (update) operations, the body can contain a field for the current identifier (prefixed with "old"), in case it is going to be changed.

E.g. `PUT /companies`
```
{
  "oldName": "Company 1",
  "name": "Company 2"
}
```
This happens, because the `name` property is used as an unique identifier in a company, asset, or unit. The only one that differs is users. Its identifier is the `username`.
This feature does not include the internal `_id` used by mongoose.

## Testing
This API can be tested automatically using `npm test` or manually, by using the [Postman](https://github.com/Felipe31/CRUD-API/blob/main/postman/Tractian%20Backend.postman_collection.json) file (which contains one test case for each route). The Postman tests also need the environment [variables](https://github.com/Felipe31/CRUD-API/blob/main/postman/Localhost.postman_environment.json).

## Database

The database used in this project is mongodb and the connection to it was made using `mongoose` and [mongodb atlas](https://www.mongodb.com/atlas/database). To connect this application to your mongodb database, you need to create a `.env` file, and set the variables shown in `.env.example`.

For example:
```
DB_HOST="mycluster.path.mongodb.net/mydb?retryWrites=true&w=majority"
DB_USER="my_user"
DB_PASSWORD="my_password"

HOST="localhost"
PORT="1234
```