
const email = document.querySelector('#email')
const password  = document.querySelector('#password')

const loginBtn = document.querySelector('#loginBtn')

loginBtn.addEventListener('click', (e)=>{
    e.preventDefault()

    if(email.value === ''){
        email.placeholder = "Please enter your email"
        email.classList.add("empty")
    } 
    else if(password.value===''){
        password.placeholder = "Please enter your password"
        password.classList.add("empty")
    }else{
        let userDetails = {
            email:email.value, password: password.value
        }
        //console.log(userDetails)
        axios.post('http://localhost:3000/login', userDetails)
        .then((res)=>{
            console.log(res.status)

            if(res.status == 200){
                
                localStorage.setItem('token', res.data.token)
                localStorage.setItem('userDetails', JSON.stringify({name:res.data.name, email: res.data.email}))
                window.location.replace('../HomePage/home.html')
            }
            
        }).catch(err=>{
            //console.log(err)
            const errMsg = err.toString()
            //console.log(errMsg)
            if(errMsg == 'Error: Request failed with status code 404'){
                showPopupMessage(true)
            }
            else if(errMsg == 'Error: Request failed with status code 401'){
                showPopupMessage(false)
            }
        })
    }

})


function showPopupMessage(flag){
    const popContainer = document.querySelector('.popup-container')
    const popMessage = document.querySelector('.popup-message')


    if(flag){
        popMessage.innerHTML = `
        <p>User doesn't exist</p>
        <p>Please Signup to create account</p>
        `
    }else{
        popMessage.innerHTML = `
        <p>Incorrect Password.</p>`
    }

    popContainer.classList.add('active')

    setTimeout(()=>{
        popContainer.classList.remove('active')
    }, 3000)
}