const token = localStorage.getItem('token')
var addExpenseBtn = document.querySelector(".submit-btn")
var itemList = document.querySelector("#items") 
var filter = document.querySelector("#filter")


addExpenseBtn.addEventListener("click", addItem)
itemList.addEventListener("click", removeElement)
filter.addEventListener("keyup", filterItems)

let amount= document.querySelector("#amount")
let description = document.querySelector("#description")
let category = document.querySelector('#category')


window.addEventListener('DOMContentLoaded', (e)=>{
    axios.get('http://localhost:3000/home', { headers: {"Authorization" : token} })
    .then(user=>{

        console.log(user.data.user.isPremium)

        let premium = user.data.user.isPremium

        if(premium){
            let premiumDiv = document.querySelector(".premium-feature")

            premiumDiv.innerHTML = `
            <li><a href="../LeaderboardPage/leaderboard.html" id="leaderboard">Leaderboard</a></li>
            <li><a href="../ReportPage/report.html" id="report">Report</a></li>
            <li><button id="darkmode">Dark Mode</button></li>
            `

            let leaderboardBtn = document.querySelector('#leaderboard')
            let darkModeBtn = document.querySelector('#darkmode')

        }

        axios.get('http://localhost:3000/home/getExpenses', { headers: {"Authorization" : token} })
        .then(res=>{
        console.log(res)

            let expenses = res.data.expenses

            for(let i=0; i<expenses.length; i++){
                let expId = expenses[i].id
                let expAmount = expenses[i].amount
                let expCategory = expenses[i].category
                let expDescription = expenses[i].description
                let expDate = expenses[i].createdAt.slice(0,10)

                displayExpense(expAmount, expCategory, expDescription, expDate, expId)
            }
        })
    })
    
})

const btn = document.getElementById("btn");
const nav = document.getElementById("nav");

btn.addEventListener("click", () => {
    nav.classList.toggle("active");
    btn.classList.toggle("active");
});

function addItem(e){
    e.preventDefault()
    let expense = {amount: amount.value, description: description.value, category: category.value}
    const token = localStorage.getItem('token')
    axios.post('http://localhost:3000/home/addExpense',{expense},{ headers: {"Authorization" : token} })
    .then(res=>{
        let addedExpense = res.data.result
        let date = addedExpense.createdAt.slice(0,10)

        displayExpense(addedExpense.amount, addedExpense.category, addedExpense.description, date)

        
    })
    .catch(err=>{
        console.log(err)
    })


}

function removeElement(e){
    if(e.target.classList.contains("delete")){
        if(confirm("Are you sure?")){
            let id = e.target.parentElement.id
            axios.post('http://localhost:3000/home/deleteExpense',{id},{ headers: {"Authorization" : token} })
            .then((res)=>{
                console.log(res)

                var li = e.target.parentElement
                itemList.removeChild(li)
            }).catch(err=>console.log(err))

            
        }
    }
}

var n = itemList.children.length

for(i=0; i<n; i++){
    var editBtn = document.createElement("button")

    editBtn.appendChild(document.createTextNode("Edit"))
    editBtn.className = "btn btn-sm float-right edit"

    itemList.children[i].appendChild(editBtn)
}

function filterItems(e){
    
    var text = e.target.value.toLowerCase()
    //console.log(text)

    // Get List
    var items = itemList.querySelectorAll("li")
    //console.log(item)

    Array.from(items).forEach(item => {
        var itemName = item.firstChild.textContent
        
        if(itemName.toLowerCase().indexOf(text) != -1){
            item.style.display = "block"
        }else{
            item.style.display = "none"
        }

    });
}

function displayExpense(expAmount, expCategory, expDescription, expDate, expId){
    let newExpense = `
            ${expAmount} : ${expCategory} : ${expDescription} : ${expDate}

        `
        // Creating new list element
        var li = document.createElement("li")
        li.className = "list-group-item"
        li.id = expId
        // Adding text node with input value
        li.appendChild(document.createTextNode(newExpense))

        // Creating del button element
        var delBtn = document.createElement("button")
        delBtn.className = "btn btn-danger btn-sm float-right delete"

        delBtn.appendChild(document.createTextNode("X"))

        li.appendChild(delBtn)

        itemList.appendChild(li)
}

let premiumBtn = document.getElementById('premium')

premiumBtn.addEventListener('click', buyPremium)

async function buyPremium(e){

    e.preventDefault();
        const response  = await axios.get('http://localhost:3000/home/purchasePremium', { headers: {"Authorization" : token} });
        console.log(response);
        var options =
        {
         "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
         "name": "Test Company",
         "order_id": response.data.order.id, // For one time payment
         "prefill": {
           "name": "Test User",
           "email": "test.user@example.com",
           "contact": "7003442036"
         },
         "theme": {
          "color": "#3399cc"
         },
         // This handler function will handle the success payment
         "handler": function (response) {
             console.log(response);
             axios.post('http://localhost:3000/home/updateTransactionStatus',{
                 order_id: options.order_id,
                 payment_id: response.razorpay_payment_id,
             }, { headers: {"Authorization" : token} }).then(() => {
                 alert('You are a Premium User Now')
             }).catch(() => {
                 alert('Something went wrong. Try Again!!!')
             })
         },
      };


      const rzp1 = new Razorpay(options);
      rzp1.open();
      e.preventDefault();

      rzp1.on('payment.failed', function (response){
        alert("payment failed");
        // alert(response.error.description);
        // alert(response.error.source);
        // alert(response.error.step);
        // alert(response.error.reason);
        // alert(response.error.metadata.order_id);
        // alert(response.error.metadata.payment_id);
    });

}

let logoutBtn = document.querySelector('#logout')

logoutBtn.addEventListener('click', (e)=>{
    localStorage.clear()
    window.location.replace('../LoginPage/login.html')
})

