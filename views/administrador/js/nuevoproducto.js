import { mostrarAlerta } from "./mostrarAlerta.js"

const formulario = document.querySelector('#formulario');
formulario.addEventListener('submit',validarProducto);

async function validarProducto(e){
    e.preventDefault();

    const nombre = document.querySelector('#nombre').value;
    const precio = parseInt(document.querySelector('#precio').value);
    const categoria = parseInt(document.querySelector('#categoria').value);

    const producto = {
        nombre,
        precio,
        categoria
    }

    if(validar(producto)){
        //console.log('todos los campos son obligatorios')
        mostrarAlerta('Todos los campos son obligatorios')
    }else{
        const productos = await axios.post('/api/comidas',{nombre:nombre,precio:precio,categoria:categoria})
        console.log(productos)
        const arrayProductos = productos.data.lista
        window.location.href = "/admin-panel"
    }
}

function validar(obj){
    return !Object.values(obj).every(i=>i!=='');
}