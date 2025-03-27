const btnGuardarCliente = document.querySelector('#guardar-cliente')
const user = JSON.parse(localStorage.getItem('user'))
cerrarBtn = document.querySelector('#cerrar-btn')

if(!user){
  window.location.href = '/'
}

//guardar la informacion del cliente
let cliente={
  mesa:'',
  hora:'',
  pedido:[]
}

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

btnGuardarCliente.addEventListener('click',guardarCliente)

function guardarCliente() {
  const mesa = document.querySelector('#mesa').value
  const hora = document.querySelector('#hora').value
  //console.log('boton')
  //console.log(mesa,hora)

  const camposVacios = [mesa,hora].some(i=>i=='')
  //console.log(camposVacios)

  if(camposVacios){
    //campos vacios
    //console.log('debe llenar cada campo')

    const existeAlerta = document.querySelector('.invalid')

    if(!existeAlerta){
      const alerta = document.createElement('div')
      alerta.classList.add('d-block','text-center','invalid')
      alerta.textContent = 'Los campos son obligatorios'
      document.querySelector('.modal-body').appendChild(alerta)
  
      setTimeout(() => {
        alerta.remove()
      }, 3000);
    }

  }else{
    //campos llenos
    cliente = {...cliente,mesa,hora}
    //console.log(cliente)
    var modalFormulario = document.querySelector('#formulario')
    var modal = bootstrap.Modal.getInstance(modalFormulario)
    modal.hide()
    const formulario = document.querySelector('form')
    formulario.reset()
    mostrarSeccion()
    obtenerMenu()
  }
}

async function obtenerMenu(){
  const productos = await axios.get('/api/comidas/lista-comidas')
  const arrayProductos = productos.data.data
  mostrarMenu(arrayProductos)
}

function mostrarMenu(menu){
  //recibo como parametro el arreglo donde se encuentra el menu
  const contenido = document.querySelector('#menu .contenido')
  menu.forEach(i=>{
    const fila = document.createElement('div')
    fila.classList.add('row', 'border-top')

    const nombre = document.createElement('div')
    nombre.textContent = i.nombre
    nombre.classList.add('col-md-3', 'py-3', 'text-uppercase')

    const precio = document.createElement('div')
    precio.textContent = `$${i.precio}`
    precio.classList.add('col-md-3', 'py-3', 'text-success')

    const categoria = document.createElement('div')
    categoria.textContent = categorias[i.categoria]  //para la traduccion del numero de categ.
    categoria.classList.add('col-md-3', 'py-3')

    const inputCantidad = document.createElement('input')
    inputCantidad.type = 'number'
    inputCantidad.min = 0
    inputCantidad.value = 0
    inputCantidad.id = `producto-${i.id}`
    inputCantidad.onchange = function(){
      const cantidad = parseInt(inputCantidad.value)
      agregarOrden({...i,cantidad}) //({...i},cantidad) <-ERROR video, de esta forma siempre recibe el arreglo vacío
    }

    const agregar = document.createElement('div')
    agregar.classList.add('col-md-3', 'py-3')
    agregar.appendChild(inputCantidad)


    fila.appendChild(nombre)
    fila.appendChild(precio)
    fila.appendChild(categoria)
    fila.appendChild(agregar)

    contenido.appendChild(fila)
  })
}

function agregarOrden(producto){
  //console.log(producto)
  let {pedido} = cliente

  if(producto.cantidad>0){
    //validar que el producto existe
    if(pedido.some(item=>item.id === producto.id)){
      const pedidoActualizado = pedido.map(i=>{
        if(i.id === producto.id){
          i.cantidad = producto.cantidad;
        }
        return i;
      })

      cliente.pedido = [...pedidoActualizado]
      console.log('existe y actualizo cantidad',cliente)

    }else{
      //caso de que no existe
      //lo agrego al arreglo pedido
      cliente.pedido = [...pedido,producto]
      console.log('no existe y lo agrego',cliente)

    }
  }else{
    //caso donde cantidad = 0
    const resultado = pedido.filter(i=> i.id !== producto.id);
    cliente.pedido = resultado
    console.log('cantidad 0',cliente)
  }

  limpiarHTML();

  if(cliente.pedido.length){
    actualizarResumen();
  }else{
    //pedido vacío
    mensajePedidoVacio();
  }


}

function mensajePedidoVacio(){
  const contenido = document.querySelector('#resumen .contenido');
  const texto = document.createElement('p');
  texto.classList.add('text-center');
  texto.textContent = 'Debes agregar productos al pedido'

  contenido.appendChild(texto)
}

function limpiarHTML(){
  const contenido = document.querySelector('#resumen .contenido')
  while(contenido.firstChild){
    contenido.removeChild(contenido.firstChild);
  }
}

function actualizarResumen(){
  const contenido = document.querySelector('#resumen .contenido');
  const resumen = document.createElement('div');
  resumen.classList.add('col-md-6','card','py-5','px-3','shadow');

  //mostrar la mesa
  const mesa = document.createElement('p');
  mesa.textContent = 'Mesa: ';
  mesa.classList.add('fw-bold');

  const mesaCliente = document.createElement('span');
  mesaCliente.textContent = cliente.mesa;
  mesaCliente.classList.add('fw-normal');
  mesa.appendChild(mesaCliente);

  //mostrar la hora
  const hora = document.createElement('span');
  hora.textContent = 'Hora: ';
  hora.classList.add('fw-bold');

  const horaCliente = document.createElement('span');
  horaCliente.textContent = cliente.hora;
  horaCliente.classList.add('fw-normal');
  hora.appendChild(horaCliente);

  //mostrar items del menu contenidos
  const heading = document.createElement('h3');
  heading.textContent = 'Pedidos';
  heading.classList.add('my-4');

  const grupo = document.createElement('ul');
  grupo.classList.add('list-group')

  //producto pedido
  const {pedido} = cliente;
  pedido.forEach(item=>{
    const {nombre,precio,cantidad,id} = item;
    const lista = document.createElement('li');
    lista.classList.add('list-group-item');

    //mostrar nombre
    const nombreP = document.createElement('h4');
    nombreP.classList.add('text-center', 'my-4');
    nombreP.textContent = nombre;

    //mostrar cantidad
    const cantidadP = document.createElement('p');
    cantidadP.classList.add('fw-bold');
    cantidadP.textContent = 'Cantidad: ';

    const cantidadValor = document.createElement('p');
    cantidadValor.classList.add('fw-normal');
    cantidadValor.textContent = cantidad;

    const precioP = document.createElement('p');
    precioP.classList.add('fw-bold');
    precioP.textContent = 'Precio: ';

    const precioValor = document.createElement('p');
    precioValor.classList.add('fw-normal');
    precioValor.textContent = `$${precio}`;

    const subtotalP = document.createElement('p');
    subtotalP.classList.add('fw-bold');
    subtotalP.textContent = 'Subtotal: ';

    const subtotalValor = document.createElement('p');
    subtotalValor.classList.add('fw-normal');
    subtotalValor.textContent = calcularSubtotal(item); //crear función para calcular el valor

    //btn para eliminar pedido
    const btnEliminar = document.createElement('button');
    btnEliminar.classList.add('btn','btn-danger');
    btnEliminar.textContent = 'Eliminar pedido';

    //event para eliminar pedido
    btnEliminar.onclick = function(){
      eliminarProducto(id);
    }

    //agregar los labels a los contenedores
    cantidadP.appendChild(cantidadValor);
    precioP.appendChild(precioValor);
    subtotalP.appendChild(subtotalValor);

    lista.appendChild(nombreP);
    lista.appendChild(cantidadP);
    lista.appendChild(precioP);
    lista.appendChild(subtotalP);
    lista.appendChild(btnEliminar);

    grupo.appendChild(lista);

  })

  resumen.appendChild(mesa);
  resumen.appendChild(hora);
  resumen.appendChild(heading);
  resumen.appendChild(grupo);

  //agregamos en contenido
  contenido.appendChild(resumen)

  formularioPropinas();
}

function eliminarProducto(id){
  const {pedido} = cliente;
  cliente.pedido = pedido.filter(i=>i.id !== id);

  limpiarHTML();

  if(cliente.pedido.length){
    actualizarResumen();
  }else{
    //pedido vacío
    mensajePedidoVacio();
  }

  //console.log(id);
  const productoEliminado = `#producto-${id}`
  const inputEliminado = document.querySelector(productoEliminado);
  inputEliminado.value = 0;
}

function calcularSubtotal(item){
  const {cantidad,precio} = item;
  return `$${cantidad*precio}`;
}

function formularioPropinas(){
  const contenido = document.querySelector('#resumen .contenido');
  const formulario = document.createElement('div');
  formulario.classList.add('col-md-6','formulario');

  const heading = document.createElement('h3');
  heading.classList.add('my-4');
  heading.textContent = 'Propina: ';

  //propinas 5%
  const radio5 = document.createElement('input');
  radio5.type = 'radio';
  radio5.name = 'propina';
  radio5.value = '5';
  radio5.classList.add('form-check-input');
  //crear evento aqui
  radio5.onclick = calcularPropina;

  const radioLabel5 = document.createElement('label');
  radioLabel5.textContent = '5%';
  radioLabel5.classList.add('form-check-label');

  const radioDiv5 = document.createElement('div');
  radioDiv5.classList.add('form-check');

  //propinas 10%
  const radio10 = document.createElement('input');
  radio10.type = 'radio';
  radio10.name = 'propina';
  radio10.value = '10';
  radio10.classList.add('form-check-input');
  //crear evento aqui
  radio10.onclick = calcularPropina;

  const radioLabel10 = document.createElement('label');
  radioLabel10.textContent = '10%';
  radioLabel10.classList.add('form-check-label');

  const radioDiv10 = document.createElement('div');
  radioDiv10.classList.add('form-check');

  radioDiv5.appendChild(radio5);
  radioDiv5.appendChild(radioLabel5);
  radioDiv10.appendChild(radio10);
  radioDiv10.appendChild(radioLabel10);

  formulario.appendChild(radioDiv5);
  formulario.appendChild(radioDiv10);
  contenido.appendChild(formulario);
}

function calcularPropina(){
  //console.log('calcular propina');
  const radioSelect = parseInt(document.querySelector('[name="propina"]:checked').value);
  console.log(radioSelect)

  const {pedido} = cliente;
  console.log(pedido);

  let subtotal = 0;
  pedido.forEach(item=>{
    subtotal += item.cantidad * item.precio;
  });

  const divTotales = document.createElement('div');
  divTotales.classList.add('total-pagar');
  
  //propina
  const propina = (subtotal * radioSelect)/100;
  const total = propina + subtotal;

  //subtotal
  const subtotalParrafo = document.createElement('p');
  subtotalParrafo.classList.add('fs-3','fw-bold','mt-5');
  subtotalParrafo.textContent = 'Subtotal consumo: ';

  const subtotalP = document.createElement('p');
  subtotalP.classList.add('fs-normal');
  subtotalP.textContent = `$${subtotal}`;
  subtotalParrafo.appendChild(subtotalP)

  const propinaParrafo = document.createElement('span');
  propinaParrafo.classList.add('fs-normal');
  propinaParrafo.textContent = 'Propina: ';

  const propinaP = document.createElement('span');
  propinaP.classList.add('fs-normal');
  propinaP.textContent = `$${propina}`;
  propinaParrafo.appendChild(propinaP);

  //total
  const totalParrafo = document.createElement('p');
  totalParrafo.classList.add('fs-3','fw-bold','mt-5');
  totalParrafo.textContent = 'Total a pagar';

  const totalp = document.createElement('p');
  totalp.classList.add('fs-normal');
  totalp.textContent = `$${total}`;

  totalParrafo.appendChild(totalp);

  const totalPagarDiv = document.querySelector('.total-pagar');

  if(totalPagarDiv){
    totalPagarDiv.remove()
  }

  divTotales.appendChild(subtotalParrafo);
  divTotales.appendChild(propinaParrafo);
  divTotales.appendChild(totalParrafo);

  const formulario = document.querySelector('.formulario');
  formulario.appendChild(divTotales);


}

function mostrarSeccion(){
  const secciones = document.querySelectorAll('.d-none')
  //console.log(secciones)
  secciones.forEach(i => i.classList.remove('d-none'));
}

cerrarBtn.addEventListener('click', (e)=>{
  localStorage.removeItem('user');
  window.location.href = '/'
})