let name = document.querySelector('#name')
let email = document.querySelector('#email')
let phone = document.querySelector("#phone")
let password = document.querySelector('#password')

const signupButton = document.querySelector('button')

signupButton.addEventListener('click', (e)=>{
    e.preventDefault()

    if(name.value === ''){
        name.placeholder = "Please enter the user name"
        name.classList.add("empty")
    }
    else if(email.value === ''){
        email.placeholder = "Please enter your email"
        email.classList.add("empty")
    }
    else if(phone.value===''){
        phone.placeholder = "Please enter your phone number"
        phone.classList.add("empty")
    }
    else if(password.value===''){
        password.placeholder = "Please enter your password"
        password.classList.add("empty")
    }else{
        let userDetails = {
            name: name.value, email:email.value, phone:phone.value, password: password.value
        }
        console.log(userDetails)
        axios.post('http://localhost:3000/signup', userDetails)
        .then((res)=>{
            console.log(res.data.flag)

            showPopupMessage(res.data.flag)

        }).catch(err=>console.log(err))
    }

})

function showPopupMessage(flag){
    const popContainer = document.querySelector('.popup-container')
    const popMessage = document.querySelector('.popup-message')


    if(flag){
        popMessage.innerHTML = `
        <p>Signup Successful</p>
        <p>Please go to Login Page to login to your account.</p>
        `
    }else{
        popMessage.innerHTML = `
        <p>User already exists. Please login</p>`
    }

    popContainer.classList.add('active')

    setTimeout(()=>{
        popContainer.classList.remove('active')
    }, 3000)
}