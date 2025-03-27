export function mostrarAlerta(mensaje){
    const alerta = document.querySelector('.bg-red-100');

    //console.log(!alerta)

    if(!alerta){
        const alert = document.createElement('p');
        alert.classList.add('bg-red-100','boder-red-400','text-red-700','px-4','py-3','rounded','text-center');
        //console.log(alert)
        alert.innerHTML=`
            <strong class="font-bold">Error!</strong>
            <span>${mensaje}</span>
        `
        formulario.appendChild(alert);

        setTimeout(() => {
            alert.remove()
        }, 3000);
    }
}