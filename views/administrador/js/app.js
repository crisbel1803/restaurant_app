const listado = document.querySelector('#listado-Productos')
listado.addEventListener('click', confirmarEliminar)
document.addEventListener('DOMContentLoaded',mostarProductos)

async function mostarProductos(){
    const productos = await axios.get('/api/comidas/lista-comidas')

    const arrayProductos = productos.data.data

    const categorias = { 
        //esto es para traducir las categorias que estan enumeradas, 
        // y mostrarlas al usuario con su respectivo nombre
        1:'Pizzas',
        2:'Postres',
        3:'Bebidas',
        4:'Comida',
        5:'Cafés',
        6:'Contornos'
      
      }

    arrayProductos.forEach(i => {
        const {id,nombre,precio,categoria} = i
        const row = document.createElement('tr')
        row.innerHTML = `
        <td class="px-6 py-4 uppercase">${nombre}</td>
        <td class="px-6 py-4 text-green-700">$${precio}</td>
        <td class="px-6 py-4">${categorias[i.categoria]}</td>

        <td class="px-6 py-4">
            <a href="editar-producto.html?id=${id}" class="text-teal-500 hover:underline">Editar</a>
            <br>
            <a href="#" id="${id}" class="text-red-500 hover:underline eliminar">Eliminar</a>
        </td>
        `
        row.classList.add('hover:bg-gray-200')

        listado.appendChild(row)
    });

}

async function confirmarEliminar(e){
    if(e.target.classList.contains('eliminar')){
        const confirmar = confirm('Desea eliminar este producto?')
        if(confirmar){
            const id = e.target.id
            console.log(id)
            const response = await axios.post('/api/comidas/eliminar', {id})
            limpiarHTML()
            mostarProductos()
        }
    }
}

function limpiarHTML(){
    while(listado.firstChild){
        listado.removeChild(listado.firstChild)
    }
}