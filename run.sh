#!/bin/sh

while ! nc -z $MYSQL_HOST $MYSQL_PORT; do
    echo "Waiting for the MySQL Server"
    sleep 3
done

npm run db:sync
npm start