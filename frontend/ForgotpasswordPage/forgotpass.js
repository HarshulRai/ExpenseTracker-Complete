const email = document.querySelector('#email')

const resetBtn = document.querySelector('#resetBtn')

resetBtn.addEventListener('click', (e)=>{
    e.preventDefault()

    if(email.value === ''){
        email.placeholder = "Please enter your email"
        email.classList.add("empty")
    }else{
        axios.post('http://localhost:3000/forgotpassword', {email:email.value})
        .then(res=>{
            console.log(res)
        })
        .catch(err=>{
            let errMsg = err.toString()
            if(errMsg == 'Error: Request failed with status code 401'){
                showPopupMessage('Somthing went wrong')
            }else{
                showPopupMessage('User does not exist')
            }
        })
    }

})


function showPopupMessage(msg){
    const popContainer = document.querySelector('.popup-container')
    const popMessage = document.querySelector('.popup-message')

    popMessage.innerHTML = `
        ${msg}
        `
    popContainer.classList.add('active')

    setTimeout(()=>{
        popContainer.classList.remove('active')
    }, 3000)
}