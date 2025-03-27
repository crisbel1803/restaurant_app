import { mostrarAlerta } from "./mostrarAlerta.js"

const nombreInput = document.querySelector('#nombre');
const precioInput = document.querySelector('#precio');
const categoriaInput = document.querySelector('#categoria');

document.addEventListener('DOMContentLoaded', async ()=>{
    //consultar en la url para extraer y guardar el id que enviamos en la ruta
    const parametrosURL = new URLSearchParams(window.location.search);
    const id = parametrosURL.get('id');

    if (!id) {
        mostrarAlerta('ID de producto no encontrado en la URL', 'error');
        return;
    }

    const response = await axios.get(`/api/comidas/producto?id=${id}` )
    const producto = response.data.data
    mostrarProducto(producto);

    //hacer el registro desde el formulario
    const formulario = document.querySelector('#formulario');
    formulario.addEventListener('submit',validarProducto)

})

async function validarProducto(e){
    e.preventDefault();
    const parametrosURL = new URLSearchParams(window.location.search);
    const id = parametrosURL.get('id');
    
    const productoAct = {
        nombre: nombreInput.value,
        precio: parseInt(precioInput.value),
        categoria: parseInt(categoriaInput.value),
        id: id
    }

    if(validar(productoAct)){
        mostrarAlerta('Todos los campos son obligatorios');
        return;
    }
    console.log(productoAct)
    await axios.post('/api/comidas/actualizar',productoAct); 
    window.location.href = '/admin-panel'
}

function mostrarProducto(producto){
    //muestra los datos del producto en la interfaz de editar
    const { nombre, precio, categoria} = producto;

    nombreInput.value= producto.nombre;
    precioInput.value= producto.precio;
    categoriaInput.value= producto.categoria;
}

function validar(objeto){
    return !Object.values(objeto).every(element=>element!=='')
}