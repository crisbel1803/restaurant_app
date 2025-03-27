//hacer el router. conecta el CONTROLLER con la BD CRUD
//router: registrar, consultar, eliminar, editar
//POST, GET, DELETE, UPDATE
const express = require('express');
const comidaRouter = express.Router();
const comida = require('../models/comida')

//registrar la informacion que la comida envia
// a traves del form

comidaRouter.post('/',(request,response)=>{
    //para agregar un nuevo producto / comida
    const { nombre, precio, categoria } = request.body;  //esto es lo que estoy recibiendo del front 
        console.log(nombre, precio, categoria) //aqui pruebo si esta llegando el dato al backend
        //este console.log va a aparecer en la terminal de VS
    
    
        if (!nombre || !precio || !categoria){
            return response.status(400).json({error: 'Todos los campos son obligatorios'});
        }else{
            //guardar en la bd
            let producto = new comida({ nombre, precio, categoria });
            producto.nombre = nombre
            producto.precio = precio
            producto.categoria = categoria
    
            async function guardarComida(){
                await producto.save() //aqui es donde guardo en la  bd
                //consultar todos los productos en ese modelo
                const listaComidas = await comida.find()
                console.log(listaComidas) //terminal VS
            }
    
            guardarComida().catch(console.error)  
    
            return response.status(200).json({mensaje: 'Se ha creado el nuevo producto'})
        }
})

comidaRouter.get('/lista-comidas',async(request,response)=>{
    //obtener lista de productos / comidas
    try{
        const listado = await comida.find()
        console.log(listado)
        return response.status(200).json({textOk:true,data:listado})
    }catch(error){
        return response.status(400).json({error:'Ha ocurrido un error'})
    }
})

comidaRouter.post('/actualizar',async (request,response)=>{
    //editar producto del menu
    console.log('edito')
    const {nombre, precio, categoria, id} = request.body;
    console.log(request.body)
    try{    
            if(!nombre || !precio || !categoria || !id){
                return response.status(400).json({error: 'Todos los campos son obligatorios'});
            }else {
                const updatedProducto = await comida.findOneAndUpdate({_id:id},{ nombre: nombre, precio: precio, categoria: categoria });
                if (!updatedProducto) {
                    return response.status(400).json({error: 'Producto no encontrado'});
                }

                return response.status(200).json({mensaje:'Se ha actualizado correctamente'})
            }
    
        }catch(error){
            response.status(404).json({error:'error al editar comida'})
        }
})

comidaRouter.post('/eliminar',async(request,res)=>{
    //eliminar producto del menu de comidas
    const {id} = request.body
    console.log(id)

    try{
        const producto = await comida.deleteOne({_id:id})
        const listado = await comida.find()
        return res.status(200).json({mensaje:'Se ha eliminado el producto'})

    }catch(error){
        return res.status(400).json({error: 'Error al eliminar el producto'})

    }
})

//buscar un solo producto del menu
comidaRouter.get('/producto',async(req,response)=>{
    //obtener un producto
    const {id} = req.query
    try{
        const producto = await comida.findOne({_id:id})
        return response.status(200).json({textOk:true,data:producto})
    }catch(error){
        return response.status(400).json({error:'Ha ocurrido un error'})
    }
})


module.exports = comidaRouter