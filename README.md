# book-summary-backend
Book summary of top goodreads books

# Local Testing

## APIs
Import Postman API collection from `postman/collections/OpenAPI.json` to your Postman client.

## Database
* `sudo brew services start mongodb-community@6.0`
* `sudo brew services stop mongodb-community@6.0`
* Setup MongoDB locally. I suggest to setup MongoDB Compass client and `mongod` CLI.
* Start the server before running the application, else it will fail.

## Redis
* Local: `redis-server`
* Production: `https://app.redislabs.com/`

### Troubleshoot
* `ps aux | grep -v grep | grep mongod`: Check mongo running port
* `pgrep mongod`
* Login to terminal: `mongosh`, `show databases`
* If not starting: 
```shell
rm -f /tmp/mongodb-27017.sock
mkdir -p /Users/gaganmani/data/db
sudo mongod --dbpath ~/data/db # start 
```

```shell
npx eslint --ext .ts src/ # ES Lint
npm run start
```


# Deployment

Endpoint: https://book-summary-backend.herokuapp.com/

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