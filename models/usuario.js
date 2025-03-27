const mongoose = require('mongoose')

/*conectar a la bd 
mongoose.connect('ruta de conexion')*/

//definir el esquema para el modelo usuarios
const usuarioSchema = new mongoose.Schema({
    nombre:String,
    password:String,
    rol:{
        type:String,
        default:"mesero"
    }
})

//configurar la respuesta del usuario en el esquema
usuarioSchema.set('toJSON',{
    transform:(document,returnObject) =>{
        returnObject.id = returnObject._id.toString()
        delete returnObject._id 
    }  
})

//seleccionar un nombre, registrar en modelo (tabla)
const usuario = mongoose.model('usuario',usuarioSchema)

//exportar
module.exports = usuario