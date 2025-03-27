const mongoose = require('mongoose')

/*conectar a la bd 
mongoose.connect('ruta de conexion')*/

//definir el esquema para el modelo comidas
const comidaSchema = new mongoose.Schema({
    nombre:String,
    precio:Number,
    categoria:Number,
})

//configurar la respuesta de la comida en el esquema
comidaSchema.set('toJSON',{
    transform:(document,returnObject) =>{
        returnObject.id = returnObject._id.toString()
        delete returnObject._id 
    }  
})

//seleccionar un nombre, registrar en modelo (tabla)
const comida = mongoose.model('comida',comidaSchema)

//exportar
module.exports = comida