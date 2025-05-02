const token = localStorage.getItem("token");
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
  showTodo(currentDate);
}

prevBtn.addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() - 1);
  updateDateDisplay();
  
});

nextBtn.addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() + 1);
  updateDateDisplay();
  
});



// todo
const todoSection = document.querySelector("#todoSection");
const todoDate = document.querySelector("#todoListDate");
const todoList = document.querySelector("#todoList");
const addTodoForm = document.querySelector("#addTodoForm");
const todoHeaderDate = dateElement.textContent;




addTodoForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const todoTask = document.querySelector("#todo").value;
  
  

  try{
    await axios.post("/api/addTodo",{ todoTask}, {
      headers:{
        Authorization: `Bearer ${token}`,
      }
    });
   addTodoForm.reset();
   await showTodo(currentDate);
  }catch(err){
    console.error(err);
  }

})

async function showTodo(objDate, page=1, limit=10){
 const date = new Date(objDate).toISOString().split('T')[0];
  try{
    const response = await axios.get(`/api/showTodo?date=${date}&page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    const {todos, totalPages} = response.data;
    todoList.innerHTML = "";
    todos.forEach((todo) => {
      const li = document.createElement("li");
      li.textContent = todo.todoTask;
      todoList.appendChild(li);
    });
    
    renderPagination(page, totalPages, objDate);

  }catch(err){
    console.error(err);
  }
}

// dynamic pagination 
function renderPagination(currentPage, totalPages, date) {
  const container = document.getElementById("paginationControls");
  container.innerHTML = "";

  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => showTodo(date, currentPage - 1));

  const pageText = document.createElement("span");
  pageText.className = "page-number";
  pageText.textContent = `Page ${currentPage} of ${totalPages}`;

  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => showTodo(date, currentPage + 1));

  container.appendChild(prevButton);
  container.appendChild(pageText);
  container.appendChild(nextButton);
}

updateDateDisplay();

// expense daily
const expenseSection = document.querySelector("#expenseSection");
const expenseDate = document.querySelector("#expenseListDate");
const expenseListDebit = document.querySelector("#expenseListDebit");
const expenseListCredit = document.querySelector("#expenseListCredit");
const addExpenseForm = document.querySelector("#addExpenseForm");
const overAllBalance = document.querySelector("#overallAmount");
const totalExpense = document.querySelector("#totalExpense");
const totalIncome = document.querySelector("#totalIncome");

const dateElementExpense = document.getElementById("expenseListDate");
const prevBtnExpense = document.getElementById("prevDateBtnExpense");
const nextBtnExpense = document.getElementById("nextDateBtnExpense");

let currentDateExpense = new Date();

function updateDateDisplayExpense() {
  dateElementExpense.textContent = currentDateExpense.toDateString();
  showExpense(currentDateExpense);
}

prevBtnExpense.addEventListener("click", () => {
  currentDateExpense.setDate(currentDateExpense.getDate() - 1);
  updateDateDisplayExpense();
  
});

nextBtnExpense.addEventListener("click", () => {
  currentDateExpense.setDate(currentDateExpense.getDate() + 1);
  updateDateDisplayExpense();
  
});

addExpenseForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
 
  const amountType = document.querySelector("#type").value;
  const description = document.querySelector("#description").value;
  const amount = document.querySelector("#amount").value;
  const category = document.querySelector("#category").value;

  const expense = {
    amountType,
    description,
    amount,
    category
  }
  
  

  try{
    await axios.post("/api/addExpense", expense, {
      headers:{
        Authorization: `Bearer ${token}`,
      }
    });
    addExpenseForm.reset();
    await showExpense(currentDateExpense);
  }catch(err){
    console.error(err);
  }

})

async function showExpense(objDate, page=1, limit=10){
 const date = new Date(objDate).toISOString().split('T')[0];
  try{
    const response = await axios.get(`/api/showExpense?date=${date}&page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    const {expenses, totalPages} = response.data;
    expenseListCredit.innerHTML = "";
    expenseListDebit.innerHTML = "";
    let totalCredit = 0;
    let totalDebit = 0;
    let totalBalance ;
    expenses.forEach((expense) => {
      if(expense.amountType === "debit"){
        const li = document.createElement("li");
        li.style.color = "red";
        li.textContent = expense.amountType + " - " + expense.description + "- " + expense.amount + " - " + expense.category;
        expenseListDebit.appendChild(li);
        totalDebit += parseInt(expense.amount);
      }
      if(expense.amountType === "credit"){
        const li = document.createElement("li");
        li.style.color = "green";
        li.textContent = expense.amountType + " - " + expense.description + "- " + expense.amount + " - " + expense.category;
        expenseListCredit.appendChild(li);
        totalCredit += parseInt(expense.amount);
      }
      
      
      
    });
    totalExpense.textContent = "Total Expense: " + totalDebit;
    totalIncome.textContent = "Total Income: " + totalCredit;

    totalBalance = totalCredit - totalDebit;
    overAllBalance.textContent = "Overall Balance: " + totalBalance;
    
    renderPaginationExpense(page, totalPages, objDate);

  }catch(err){
    console.error(err);
  }
}

// dynamic pagination 
function renderPaginationExpense(currentPage, totalPages, date) {
  const container = document.getElementById("paginationControlsExpense");
  container.innerHTML = "";

  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => showExpense(date, currentPage - 1));

  const pageText = document.createElement("span");
  pageText.className = "page-number";
  pageText.textContent = `Page ${currentPage} of ${totalPages}`;

  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => showExpense(date, currentPage + 1));

  container.appendChild(prevButton);
  container.appendChild(pageText);
  container.appendChild(nextButton);
}


updateDateDisplayExpense();


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


