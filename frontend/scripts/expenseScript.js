const home = document.querySelector("#home");
const leaderboardBtn = document.querySelector("#leaderboard");
const premiumBtn = document.querySelector("#premium");
const userName= document.querySelector("#username");
const logoutBtn = document.querySelector("#logout");

userName.textContent= localStorage.getItem("username");

logoutBtn.addEventListener("click", async(e)=>{
  e.preventDefault();
  localStorage.clear();
  window.location.href = '/forms/index.html';
})


//header2Section
const header2Section = document.querySelector("#header2Section");
const todobtn = document.querySelector("#todo-element");
const expensebtn = document.querySelector("#expense-element");
const monthlybtn = document.querySelector("#monthly-element");
const yearlybtn = document.querySelector("#yearly-element");

//date header
const dateElement = document.getElementById("todoListDate");
const prevBtn = document.getElementById("prevDateBtn");
const nextBtn = document.getElementById("nextDateBtn");

let currentDate = new Date();

function updateDateDisplay() {
  dateElement.textContent = currentDate.toDateString();
}

prevBtn.addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() - 1);
  updateDateDisplay();
});

nextBtn.addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() + 1);
  updateDateDisplay();
});

updateDateDisplay();

// todo
const todoSection = document.querySelector("#todoSection");
const todoDate = document.querySelector("#todoListDate");
const todoList = document.querySelector("#todoList");
const addTodoForm = document.querySelector("#addTodoForm");
const todoHeaderDate = dateElement.textContent;

showTodo();

addTodoForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const todoTask = document.querySelector("#todo").value;
  const userId = localStorage.getItem("userId");

  try{
    await axios.post("/api/addTodo",{ todoTask, userId});
   addTodoForm.reset();
   await showTodo(userId, todoHeaderDate);
  }catch(err){
    console.error(err);
  }

})

async function showTodo(userId, date){
  try{
    const response = await axios.get(`/api/getTodo?userId=${userId}&date=${date}`);
    const todos = response.data;
    todoList.innerHTML = "";
    todos.forEach((todo) => {
      const li = document.createElement("li");
      li.textContent = todo.todoTask;
      todoList.appendChild(li);
    });


  }catch(err){
    console.error(err);
  }
}

// expense daily
const expenseSection = document.querySelector("#expenseSection");
const expenseDate = document.querySelector("#expenseListDate");
const expenseListDebit = document.querySelector("#expenseListDebit");
const expenseListCredit = document.querySelector("#expenseListCredit");
const addExpenseForm = document.querySelector("#addExpenseForm");

// expense monthly
const monthlyExpenseSection = document.querySelector("#monthlyExpenseSection");
const monthlyDate = document.querySelector("#monthlyListDate");
const monthlyList = document.querySelector("#expenseMonthlyList");

// expense yearly
const yearlyExpenseSection = document.querySelector("#yearlyExpenseSection");
const yearlyDate = document.querySelector("#yearlyListDate");
const yearlyList = document.querySelector("#expenseYearlyList");

//LeaderBoard
const leaderBoardSection = document.querySelector("#leaderboardSection");

// buy premium
const buyPremiumSection = document.querySelector("#buyPremiumSection");


