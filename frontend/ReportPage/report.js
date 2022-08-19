const token = localStorage.getItem('token')
const btn = document.getElementById("btn")
const dailyList = document.querySelector('#items-daily')
const weeklyList = document.querySelector('#items-weekly')
const monthlyList = document.querySelector('#items-monthly')
const filter = document.querySelector("#filter")
filter.addEventListener("keyup", filterItems)

btn.addEventListener("click", () => {
    nav.classList.toggle("active");
    btn.classList.toggle("active");
})

window.addEventListener('DOMContentLoaded', async (e)=>{
    let user = await axios.get('http://localhost:3000/home', { headers: {"Authorization" : token} })
    
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

    let dailyExpenses = await axios.get('http://localhost:3000/home/report/getDailyExpenses', { headers: {"Authorization" : token} })
    
    let dailyArray = dailyExpenses.data
    
    for(let i=0; i<dailyArray.length; i++){
        display(dailyArray[i].amount, dailyArray[i].category, dailyArray[i].description, dailyArray[i].createdAt.slice(0,10), dailyList)
    }

    let weeklyExpenses = await axios.get('http://localhost:3000/home/report/getWeeklyExpenses', { headers: {"Authorization" : token} })
    //console.log(weeklyExpenses)

    let weeklyArray = weeklyExpenses.data
    
    for(let i=0; i<weeklyArray.length; i++){
        display(weeklyArray[i].amount, weeklyArray[i].category, weeklyArray[i].description, weeklyArray[i].createdAt.slice(0,10), weeklyList)
    }

    let monthlyExpenses = await axios.get('http://localhost:3000/home/report/getMonthlyExpenses', { headers: {"Authorization" : token} }) 
    console.log(monthlyExpenses)

    let monthlyArray = monthlyExpenses.data
    
    for(let i=0; i<monthlyArray.length; i++){
        display(monthlyArray[i].amount, monthlyArray[i].category, monthlyArray[i].description, monthlyArray[i].createdAt.slice(0,10), monthlyList)
    }
})


function display(expAmount, expCategory, expDescription, expDate, itemList){

    
    let li = document.createElement("li")
    li.className = "list-group-item"
    
    li.innerHTML = `
    ${expAmount}  &emsp; &emsp; &emsp; &emsp;&emsp; &emsp; &emsp; &emsp;&emsp; &emsp; &emsp; &emsp;
    ${expCategory} &emsp; &emsp; &emsp; &emsp;&emsp; &emsp; &emsp; &emsp;&emsp; &emsp; &emsp; &emsp;
    ${expDescription} &emsp; &emsp; &emsp; &emsp;&emsp; &emsp; &emsp; &emsp;&emsp; &emsp; &emsp; &emsp;
    ${expDate} 
    `
    itemList.appendChild(li)
}

function filterItems(e){
    
    var text = e.target.value.toLowerCase()
    //console.log(text)

    // Get List
    var items = document.querySelectorAll("li")
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

let logoutBtn = document.querySelector('#logout')

logoutBtn.addEventListener('click', (e)=>{
    localStorage.clear()
    window.location.replace('../LoginPage/login.html')
})

const downloadBtn = document.querySelector('#download')

downloadBtn.addEventListener('click', (e)=>{
    e.preventDefault()

    axios.get('http://localhost:3000/home/report/download',  { headers: {"Authorization" : token} })
    .then(res=>{
        //console.log(res.data.fileURL)

        let a = document.createElement('a')
        a.href = res.data.fileURL
        a.download = 'myExpense.csv'
        a.click()
    })
    .catch(err=>console.log(err))

})

