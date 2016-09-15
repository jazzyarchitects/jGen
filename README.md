# jGen (Alpha Preview)
A cli to create node project structure

***NOTE:
  This module is under development hence not in npmjs.com. npm install jgen won't work.***

  1) Clone this repository on your system.
  2) Open this folder location in your terminal
  3) do
        ```
          $ npm install -g
        ```


## Getting Started
Create a new folder where you want to setup your project.
Open this folder in your terminal and execute

```shell
  $ jgen setup
```

Enter your project name and other details as you generally do while **npm init**.

The whole project gets setup after this which includes

1. Creating file-folder structure
2. Writing all the files
    * Create package.json
    * Create .gitignore
    * Create project files
3. Initialise git repository
4. Add git remote if specified
5. Install all dependencies

### Starting app
Start your app using
```
  $ npm start
```

## Generating Models
To create models in your app use
```
  $ jgen model <model_name>
```

It will create the basic CRUD(Create, Read, Update, Delete) routes. All the routes can be found in **/tmp/routes.html**

## Features
1. To require any file located inside *modules/* folder, you can use
    ```js
      var UserOperations = requireFromModule('users/operations');
    ```
    instead of writing the absolute file location.

2. App is created using *express.js* on *MongoDB* using *mongoose* client.
3. successJSON(*data*) and errorJSON(*errorCode*, *err*, *message*) functions are provided for sending api responses to the     client. Use
    ```js
      res.json(successJSON(result));
    ```
    It will send a json object as:

    ```json
    {
      "success": true,
      "data": "<result>"
    }
    ```
4. Java inspired logger (<a href="https://www.npmjs.com/package/jlogger">jlogger</a>) is integrated by default. Log directly anywhere from the app using *Log.e()*, *Log.w()*, *Log.i()* or *Log.d()*.
