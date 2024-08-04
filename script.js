function tologin() {
  window.location = './index.html'
}

function Signup() {

  let uname = document.getElementById('uname').value
  let email = document.getElementById('email').value
  let pswd = document.getElementById('pswd').value
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (uname == "" || email == "" || pswd == "") {
    alert("missing entries")
  }
  else if (!emailRegex.test(email)) {
    alert("not a valid email")
  }
  else if (email in localStorage) {
    alert(`an account already registered for email ${email}`)
  }

  else if (uname in localStorage) {
    alert('username not available')
  }
  else {
    const user = {
      uname: uname,
      email: email,
      pswd: pswd,
      budget: 0,
      expense: 0,
      income: 0,
      incomeLog: [],
      expenseLog: []
    }
    localStorage.setItem(uname, JSON.stringify(user))
    localStorage.setItem(email, uname)
    alert("user registered succesfully")
    window.location = './index.html'
  }
}
// login
function LogIn() {
  let nameoremail = document.getElementById("nameoremail").value
  let lpswd = document.getElementById("lpswd").value
  //  regex to check if the nameoremail is an email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(nameoremail)) {
    // nameoremail is an email
    let retrievedusername = localStorage.getItem(nameoremail);
    console.log(retrievedusername);
    var retrieveduser = JSON.parse(localStorage.getItem(retrievedusername));
    console.log(retrieveduser);
    if (retrieveduser.email == nameoremail && retrieveduser.pswd == lpswd) {
      localStorage.setItem('currentuser', retrieveduser.uname)
      alert("login successfull")
      window.location = './home.html'

    }
    else {
      alert("wrong credentials")
    }
  }
  else {
    // nameoremail is a username, get the email associated with the username

    let retrieveduser = JSON.parse(localStorage.getItem(nameoremail));
    console.log(retrieveduser);
    if (retrieveduser.uname == nameoremail && retrieveduser.pswd == lpswd) {
      localStorage.setItem('currentuser', retrieveduser.uname)
      alert("login successfull")
      window.location = './home.html'
    }
    else {
      alert("wrong credentials")
    };
  }

}

function LogOut() {
  localStorage.removeItem('currentuser');
  window.location = "./index.html"
}

function display() {
  currentuser = localStorage.getItem('currentuser')
  welcome.innerHTML = `
   <h2 >Welcome <span class="text-danger">${currentuser} <span> </h2>
   <h1 class="text-center" style="font-size: 4vw;">BUDGET
      CALCULATOR</h1>
   <button class="btn btn-danger btn-lg mt-4 mb-4 rounded-pill" onclick="LogOut()" >Logout</button>
      `
    ;
  displayboth()
  displayintable()
  displayextable()
  exChart()



}
// add income 
function addIncome() {

  let incometype = document.getElementById("incometype").value
  let incomeamount = document.getElementById("incomeamount").value

  if (incometype == '' || incomeamount == '') {
    alert("Fill empty fiels")
  }
  else {
    let user = JSON.parse(localStorage.getItem(currentuser))

    user.budget += parseFloat(incomeamount);
    user.income += parseFloat(incomeamount);

    let time = new Date();
    let date = `${time.toLocaleDateString('hi-IN')} ${time.getHours()}:${time.getMinutes()}`;
    let incomeLogObj = {
      type: incometype,
      amount: incomeamount,
      balance: user.budget,
      date: date
    }
    user.incomeLog.push(incomeLogObj);
    localStorage.setItem(user.uname, JSON.stringify(user));

    displayboth();
    displayintable();
    exChart()

  }
}

function displayintable() {
  let incomebody = document.getElementById("incomebody")
  let incomeLog = user.incomeLog
  incomebody.innerHTML = '';
  for (i of user.incomeLog) {
    let content = `<tr>
                        <td>${i.type}</td>  
                        <td>${i.amount}</td> 
                        <td>${i.balance}</td> 
                        <td>${i.date}</td>  
   </tr>`
    incomebody.innerHTML += content
  }
}


// add expense 
function addExpense() {
  let expensetype = document.getElementById("expensetype").value
  let expenseamount = document.getElementById("expenseamount").value
  let user = JSON.parse(localStorage.getItem(currentuser))
  if (expensetype == '' || expenseamount == '') {
    alert("Fill empty fiels")
  }
  else if (expenseamount <= user.budget) {
    user.budget -= parseFloat(expenseamount);
    user.expense += parseFloat(expenseamount);
    let time = new Date();
    let date = `${time.toLocaleDateString('hi-IN')} ${time.getHours()}:${time.getMinutes()}`;
    let expenseLogObj = {
      type: expensetype,
      amount: expenseamount,
      balance: user.budget,
      date: date
    }
    user.expenseLog.push(expenseLogObj);
    // console.log(user.expenseLog[6]);  
    localStorage.setItem(user.uname, JSON.stringify(user));
    displayboth();
    displayextable()
    exChart()
  }
  else {
    alert('You need a loan')
  }

}
//display expense table
function displayextable() {
  // console.log("called");
  let expensebody = document.getElementById("expensebody")
  let expenseLog = user.expenseLog
  expensebody.innerHTML = '';
  for (i of user.expenseLog) {
    let content = `<tr>
                      <td>${i.type}</td>  
                      <td>${i.amount}</td> 
                      <td>${i.balance}</td> 
                      <td>${i.date}</td>  
 </tr>`
    expensebody.innerHTML += content
  }
}



//display expense and budget 
function displayboth() {
  user = JSON.parse(localStorage.getItem(currentuser))
  // console.log(user.budget);
  budgetdisplay = document.getElementById("budget")
  budgetdisplay.innerHTML = `Budget  :₹${user.budget}`
  expensedisplay = document.getElementById("totalexpense")
  //  console.log(user.expense);
  expensedisplay.innerHTML = `Expense:₹${user.expense}`
  incomedisplay = document.getElementById("totalincome")
  incomedisplay.innerHTML = `Income  :₹${user.income}`
}

function Reset() {

  let reset = confirm("This will clear all your Logs,are you sure?")
  if (reset) {
    let user = JSON.parse(localStorage.getItem(currentuser));
    user.budget = 0;
    user.expense = 0;
    user.income = 0;
    user.incomeLog = [];
    user.expenseLog = [];
    localStorage.setItem(user.uname, JSON.stringify(user))
    displayboth();
    document.getElementById("incomebody").innerHTML = '';
    document.getElementById("expensebody").innerHTML = '';

    alert("Removed Logs")
    location.reload();
  }


}

// chart

function exChart() {
  let user = JSON.parse(localStorage.getItem(currentuser))
  let expenseLog = user.expenseLog
  let xValues = expenseLog.map(a => a.type)
  let yValues = expenseLog.map(a => a.amount)

  const expense = user.expense
  const budget = user.budget
  if (budget != 0) {
    xValues.push("budget")
    yValues.push(budget)

    var barColors = xValues.map((value, index) => {
      return index < xValues.length - 1 ? getRandomColor() : '#679c05'; // Use a fixed color for the last item (budget)
    });
  }
  else if (budget == 0 && expense != 0) {
    xValues.push("budget")
    yValues.push(budget)

    var barColors = xValues.map((value, index) => {
      return index < xValues.length - 1 ? getRandomColor() : '#679c05'; // Use a fixed color for the last item (budget)
    });
  }
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  new Chart("myChart", {
    type: "pie",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      title: {
        display: true,
        text: ""
      }
    }
  });

}