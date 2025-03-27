//hacer el router. conecta el CONTROLLER con la BD CRUD
//router: registrar, consultar, eliminar
//POST, GET, DELETE, UPDATE
const express = require('express');
const userRouter = express.Router();
const user = require('../models/usuario')

//registrar la informacion que el usuario envia
// a traves del form

userRouter.post('/',(request,response)=>{
    const { nombre, password } = request.body;  //esto es lo que estoy recibiendo del front 
    console.log(nombre, password) //aqui pruebo si esta llegando el dato al backend
    //este console.log va a aparecer en la terminal de VS


    if (!nombre || !password){
        return response.status(400).json({error: 'Todos los campos son obligatorios'});
    }else{
        //guardar en la bd
        let usuario1 = new user({ nombre, password });
        usuario1.nombre = nombre
        usuario1.password = password
        //usuario.nombre = nombre

        async function guardarUsuario(){
            await usuario1.save() //aqui es donde guardo en la  bd
            //consultar todos los usuarios en ese modelo
            const listaUsuarios = await user.find()
            console.log(listaUsuarios) //terminal VS
        }

        guardarUsuario().catch(console.error)  

        return response.status(200).json({mensaje: 'Se ha creado el nuevo usuario'})
    }
})

//obtener lista de usuarios para iniciar sesion
userRouter.get('/lista-users',async(request,response)=>{
    try{
        //let usuario = new user()
        const listado = await user.find()
         console.log(listado)
        //return response
        return response.status(200).json({textOk:true,data:listado})
    }catch(error){
        return response.status(400).json({error:'Ha ocurido un error'})
    }
})

module.exports = userRouter