# 2do node.js

## Run

    node server.js

## Heroku

    heroku login
    heroku create
    heroku config:set MONGOLAB_URI=mongodb://_username_:_password_@ds135029.mlab.com:35029/todos
    git push heroku master
    heroku ps:scale web=1
    heroku open
    
    heroku logs --tail
    heroku run bash
    

