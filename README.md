# Plannr
Scheduling web app for Design Project class.

The following versions of Python and Django were used for this app

Python 2.7.11
Django 1.10.5
```
pip install Django==1.10.5
```
Django Rest Framework 3.6.2
```
pip install djangorestframework==3.6.2
```

To run the code, go to the project's static folder and run 
```
npm install
```
Afterwards, you have to run webpack in the static folder. If you have it installed globally, a simple ```webpack``` should suffice. Else, run
```
node_modules/webpack/bin/webpack.js 
```

To run the backend, you should go to the project's root folder and run
```
./manage.py runserver
```
If you have Python 3 also installed, then
```
python2 manage.py runserver
```

The web app should then be running and it can be visited with the url given in the command line.
