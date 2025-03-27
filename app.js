require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const comidaRouter = require('./controllers/comidas'); //importar router desde el modulo controllers
const userRouter = require('./controllers/usuarios');


//conexion a la bd
//(async()=>{ como solo el controller se conecta a la bd, no es necesario hacer async-await
    try {
        mongoose.connect(process.env.MONGO_URI_TEST);
        console.log('Te has conectado a MongoDB');
    } catch (error) {
    console.log(error);
    }
//})()

//RUTAS FRONTEND RESTAURANTE
app.use('/',express.static(path.resolve('views','login'))); //INICIO SESIÓN

app.use('/mesas',express.static(path.resolve('views','restaurante'))); //INICIO
app.use('/js',express.static(path.resolve('views','restaurante','js'))); //FUNCIONALIDAD JS
app.use('/styles',express.static(path.resolve('views','css'))); //ESTILOS

//RUTAS FRONTEND ADMINISTRADOR
app.use('/admin-panel',express.static(path.resolve('views','administrador'))); //INICIO
app.use('/editar-producto',express.static(path.resolve('views','administrador','editar-producto'))); //EDITAR PRODUCTO
app.use('/nuevo-producto',express.static(path.resolve('views','administrador','nuevo-producto'))); //AGREGAR PRODUCTO
app.use('/js-admin',express.static(path.resolve('views','administrador','js'))); //FUNCIONALIDAD JS

//IMPORTANTE 
app.use(express.json())

//rutas de backend 
app.use('/api/comidas',comidaRouter) //CONTROLLER MENÚ
app.use('/api/users',userRouter) //CONTROLLER USUARIOS


module.exports = app;