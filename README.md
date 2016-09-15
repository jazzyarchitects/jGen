# jGen
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
    * Create .gitignore and .foreverignore  
    * Create project files 
3. Initialise git repository  
4. Add git remote if specified  
5. Install forever.js in your system  
6. Install all dependencies  

### Starting app  
Start your app using  
```
  $ npm start
```

The app is started using forever with the *watch* flag. All the changes you make to the scripts are automatically loaded without any manual intervention.  

## Generating Models  
To create models in your app use
```
  $ jgen model <model_name>
```

It will create the basic CRUD(Create, Read, Update, Delete) routes. All the routes can be found in **/tmp/routes.html**  
