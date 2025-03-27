//selectores
const formC = document.querySelector('#form-create')
const formL = document.querySelector('#form-login')
const createInput = document.querySelector('#create-input')
const createPasswordInput = document.querySelector('#create-password-input')
const notificacion = document.querySelector('.notification')
const loginInput = document.querySelector('#login-input') 
const loginPasswordInput = document.querySelector('#password-login-input') 

formC.addEventListener('submit',async e=>{
    e.preventDefault()

    //validamos
    console.log(createInput.value)
    console.log(createPasswordInput.value)

    const arrayUsers = await axios.get('/api/users/lista-users')
    const users = arrayUsers.data.data
    const user = users.find(user => user.nombre === createInput.value)

    if(!createInput.value || !createPasswordInput.value){
            //campo vacio
        notificacion.innerHTML=`Los campos no deben estar vacios`
        notificacion.classList.add('show-notification')
        setTimeout(()=>{
            notificacion.classList.remove('show-notification')

        }, 2000)
    }else if(user){
        //usuario existente
        notificacion.innerHTML=`El usuario ${createInput.value} ya existe`
        notificacion.classList.add('show-notification')
        setTimeout(()=>{
            notificacion.classList.remove('show-notification')

        }, 2000)
    }else{
        console.log("El campo esta lleno")

        const nombre = createInput.value
        const password = createPasswordInput.value

        //vamos a enviar info al backend
        const response = await axios.post('/api/users',{nombre:nombre,password:password})
        console.log(response)

        notificacion.innerHTML = `El usuario ${createInput.value} ha sido creado`;
        notificacion.classList.add('show-notification');
        setTimeout(()=>{
            notificacion.classList.remove('show-notification')
        },3000);
        createInput.value = '';
        createPasswordInput.value = '';
    }

})

formL.addEventListener('submit',async e=>{
    e.preventDefault();
    
    const arrayUsers = await axios.get('/api/users/lista-users')
    const users = arrayUsers.data.data
    //console.log(users.data.data)
    const user = users.find(user => user.nombre === loginInput.value && user.password===loginPasswordInput.value)
    
    console.log("si",user)

    if(!user){
        //usuario no existe
        notificacion.innerHTML = 'El usuario no existe, verifique el usuario y la contraseña'
        notificacion.classList.add('show-notification')

        setTimeout(()=>{
            notificacion.classList.remove('show-notification')

        }, 2000)
    
    }else{
        localStorage.setItem('user', JSON.stringify(user))

        if(user.nombre==loginInput.value && user.password===loginPasswordInput.value){
            if(user.rol=='mesero'){                  //EJEMPLO SI HAY VARIOS ROLES
                //dashboard mesas
                window.location.href = '/mesas';
    
            }else if(user.rol=='admin'){
                //dashboard admin
                window.location.href = '/admin-panel';
            }
        }else{
             //usuario o password incorrecto
            notificacion.innerHTML = 'User o contraseña incorrecto'
            notificacion.classList.add('show-notification')

            setTimeout(()=>{
                notificacion.classList.remove('show-notification')

            }, 2000)
        }
    }
})