# book-summary-backend
Book summary of top goodreads books

# Local Testing

## APIs
Import Postman API collection from `postman/collections/OpenAPI.json` to your Postman client.

## Database
* Setup MongoDB locally. I suggest to setup MongoDB Compass client and `mongod` CLI.
* Start the server before running the application, else it will fail.

`npm run start`

# Deployment

## Heroku

### CLI
```shell
heroku logs -a book-summary-backend --tail # logs
heroku addons | grep heroku-redis # add on list
heroku config:set NODE_ENV=prod -a book-summary-backend # set a config variable
heroku config -a book-summary-backend # check all config variables
heroku config:unset DB_CONN_STRING -a book-summary-backend # unset a config variable
heroku restart -a book-summary-backend # restart the app in prod
```