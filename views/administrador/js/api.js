const url = "http://localhost:3000/menu";

//agregar un nuevo producto
export const nuevoProducto = async producto => { //al agregar un nuevo producto, genera un id como string-------->><<<<
    try {
        await fetch (url,{
            method:'POST',
            body:JSON.stringify(producto),
            headers: {
                "content-type": "application/json"
            }
        })
    } catch (error) {
        console.log(error)
    }
}

//mostrar productos
export const obtenerProductos = async () => {
    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        return resultado;
    } catch (error) {
        console.log(error)
    }
}

//eliminar un producto
export const eliminarProducto = async id => {
    try {
        await fetch(`${url}/${id}`,{
            method:"DELETE"
        })
    } catch (error) {
        console.log(error)
    }
}

//editar un producto
export const editarProducto = async (producto) => {
    try {
        await fetch(`${url}/${producto.id}`,{
            method:"PUT",
            body:JSON.stringify(producto),
            headers: {
                "content-type":"application/json"
            }
        })
    } catch (error) {
        console.log(error)
    }
}

//buscar solo un producto
export const obtenerProducto = async id => {
    try {
        const respuesta = await fetch(`${url}/${id}`);
        const resultado = await respuesta.json();
        return resultado;
    } catch (error) {
        console.log(error)
    }
}
