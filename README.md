# 2do node.js

## Run

    npm install
    node server.js

## Heroku

    heroku login
    heroku config:set MONGOLAB_URI=mongodb://_username_:_password_@ds135029.mlab.com:35029/todos
    git push heroku master
    heroku ps:scale web=1
    heroku open
    
    heroku logs --tail
    heroku run bash
    

