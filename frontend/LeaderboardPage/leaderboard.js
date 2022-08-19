const token = localStorage.getItem('token')

const itemList = document.querySelector("#items") 
const btn = document.getElementById("btn")
const nav = document.getElementById("nav")
let filter = document.querySelector("#filter")

filter.addEventListener("keyup", filterItems)

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
        }

        axios.get('http://localhost:3000/home/leaderboard', { headers: {"Authorization" : token} })
        .then(data=>{
            console.log(data.data.totalAmount)
            let totals = data.data.totalAmount
            displayLeaderboard('0','Username', 'Total Expense')

            for(let i=0; i<totals.length; i++){
                displayLeaderboard(totals[i].userId, totals[i].name, totals[i].total_amount)
            }
        })
        .catch(err=>console.log(err))
    })
})

btn.addEventListener("click", () => {
    nav.classList.toggle("active");
    btn.classList.toggle("active");
})


function displayLeaderboard(userId, userName, userTotalExp){

    
        let li = document.createElement("li")
        li.className = "list-group-item"
        li.id = userId
   
        li.innerHTML = `
        
        ${userName}  &emsp; &emsp; &emsp; &emsp;&emsp; &emsp; &emsp; &emsp;
        &emsp; &emsp; &emsp; &emsp;&emsp; &emsp; &emsp; &emsp;
        &emsp; &emsp; &emsp; &emsp; ${userTotalExp}
        
        `
        itemList.appendChild(li)
}


function filterItems(e){
    
    var text = e.target.value.toLowerCase()
    //console.log(text)

    // Get List
    var items = itemList.querySelectorAll("li")
    //console.log(items)

    Array.from(items).forEach(item => {
        var itemName = item.firstChild.textContent
        
        if(itemName.toLowerCase().indexOf(text) != -1){
            item.style.display = "block"
        }else{
            item.style.display = "none"
        }

    });
}

let logoutBtn = document.querySelector('#logout')

logoutBtn.addEventListener('click', (e)=>{
    localStorage.clear()
    window.location.replace('../LoginPage/login.html')
})