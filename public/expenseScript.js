// section
const token = localStorage.getItem("token");
const isPremium = localStorage.getItem("isPremium") === "true";

const header2Section = document.querySelector("#header2Section");
const todoSection = document.querySelector("#todoSection");
const expenseSection = document.querySelector("#expenseSection");
const monthlyExpenseSection = document.querySelector("#monthlyExpenseSection");
const yearlyExpenseSection = document.querySelector("#yearlyExpenseSection");
const leaderBoardSection = document.querySelector("#leaderboardSection");
const buyPremiumSection = document.querySelector("#buyPremiumSection");

// home button
const home = document.querySelector("#home");
const leaderboardBtn = document.querySelector("#leaderboard");
const premiumBtn = document.querySelector("#premium");
const userName = document.querySelector("#username");
const logoutBtn = document.querySelector("#logout");

//header2
const todobtn = document.querySelector("#todo-element");
const expensebtn = document.querySelector("#daily-element");
const monthlybtn = document.querySelector("#monthly-element");
const yearlybtn = document.querySelector("#yearly-element");

const header2Items = document.querySelectorAll('.header2-right p');
header2Items.forEach(item => {
  item.addEventListener('click', () => {
    header2Items.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});


const section = [
  leaderBoardSection,
  todoSection,
  monthlyExpenseSection,
  yearlyExpenseSection,
  buyPremiumSection,
];

section.forEach((sec) => {
  sec.classList.add("hidden");
});

home.addEventListener("click", () => {
  header2Section.classList.remove("hidden");
  expenseSection.classList.remove("hidden");
  leaderBoardSection.classList.add("hidden");
  buyPremiumSection.classList.add("hidden");
  todoSection.classList.add("hidden");
  monthlyExpenseSection.classList.add("hidden");
  yearlyExpenseSection.classList.add("hidden");
});

todobtn.addEventListener("click", () => {
  header2Section.classList.remove("hidden");
  expenseSection.classList.add("hidden");
  leaderBoardSection.classList.add("hidden");
  buyPremiumSection.classList.add("hidden");
  todoSection.classList.remove("hidden");
  monthlyExpenseSection.classList.add("hidden");
  yearlyExpenseSection.classList.add("hidden");
});

expensebtn.addEventListener("click", () => {
  header2Section.classList.remove("hidden");
  expenseSection.classList.remove("hidden");
  leaderBoardSection.classList.add("hidden");
  buyPremiumSection.classList.add("hidden");
  todoSection.classList.add("hidden");
  monthlyExpenseSection.classList.add("hidden");
  yearlyExpenseSection.classList.add("hidden");
});

monthlybtn.addEventListener("click", () => {
  header2Section.classList.remove("hidden");
  expenseSection.classList.add("hidden");
  leaderBoardSection.classList.add("hidden");
  buyPremiumSection.classList.add("hidden");
  todoSection.classList.add("hidden");
  monthlyExpenseSection.classList.remove("hidden");
  yearlyExpenseSection.classList.add("hidden");
});
yearlybtn.addEventListener("click", () => {
  header2Section.classList.remove("hidden");
  expenseSection.classList.add("hidden");
  leaderBoardSection.classList.add("hidden");
  buyPremiumSection.classList.add("hidden");
  todoSection.classList.add("hidden");
  monthlyExpenseSection.classList.add("hidden");
  yearlyExpenseSection.classList.remove("hidden");
});

if (!isPremium) {
  premiumBtn.addEventListener("click", () => {
    header2Section.classList.add("hidden");
    expenseSection.classList.add("hidden");
    leaderBoardSection.classList.add("hidden");
    buyPremiumSection.classList.remove("hidden");
    todoSection.classList.add("hidden");
    monthlyExpenseSection.classList.add("hidden");
    yearlyExpenseSection.classList.add("hidden");
  });
}

if (!isPremium) {
  userName.textContent = localStorage.getItem("username");
} else {
  premiumBtn.style.display = "none";
  userName.textContent = localStorage.getItem("username") + "(Premium user)";
}

logoutBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  localStorage.clear();
  window.location.href = "/";
});

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

const todoDate = document.querySelector("#todoListDate");
const todoList = document.querySelector("#todoList");
const addTodoForm = document.querySelector("#addTodoForm");
const todoHeaderDate = dateElement.textContent;

addTodoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const todoTask = document.querySelector("#todo").value;

  try {
    await axios.post(
      "/api/addTodo",
      { todoTask },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    addTodoForm.reset();
    await showTodo(currentDate);
  } catch (err) {
    console.error(err);
  }
});

async function showTodo(objDate, page = 1, limit = 10) {
  const date = new Date(objDate).toISOString().split("T")[0];
  try {
    const response = await axios.get(
      `/api/showTodo?date=${date}&page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const { todos, totalPages } = response.data;
    todoList.innerHTML = "";
    todos.forEach((todo) => {
      const li = document.createElement("li");
      li.textContent = todo.todoTask;
      todoList.appendChild(li);
    });

    renderPagination(page, totalPages, objDate);
  } catch (err) {
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

addExpenseForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const amountType = document.querySelector("#type").value;
  const description = document.querySelector("#description").value;
  const amount = document.querySelector("#amount").value;
  const category = document.querySelector("#category").value;

  const expense = {
    amountType,
    description,
    amount,
    category,
  };

  try {
    await axios.post("/api/addExpense", expense, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    addExpenseForm.reset();
    await showExpense(currentDateExpense);
  } catch (err) {
    console.error(err);
  }
});

async function showExpense(objDate, page = 1, limit = 5) {
  const date = new Date(objDate).toISOString().split("T")[0];
  try {
    const response = await axios.get(
      `/api/showExpense?date=${date}&page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const { expenses, totalPages } = response.data;
    expenseListCredit.innerHTML = "";
    expenseListDebit.innerHTML = "";
    let totalCredit = 0;
    let totalDebit = 0;
    let totalBalance;
    expenses.forEach((expense) => {
      if (expense.amountType === "debit") {
        const li = document.createElement("li");
        li.style.color = "red";
        li.textContent =
          expense.description +
          "- " +
          expense.category +
          " - " +
          expense.amount;
        expenseListDebit.appendChild(li);
        totalDebit += parseInt(expense.amount);
      }
      if (expense.amountType === "credit") {
        const li = document.createElement("li");
        li.style.color = "green";
        li.textContent =
          expense.description +
          "- " +
          expense.category +
          " - " +
          expense.amount;
        expenseListCredit.appendChild(li);
        totalCredit += parseInt(expense.amount);
      }
    });
    totalExpense.textContent = "Total Expense: " + totalDebit;
    totalIncome.textContent = "Total Income: " + totalCredit;

    totalBalance = totalCredit - totalDebit;
    overAllBalance.textContent = "Balance: " + totalBalance;

    renderPaginationExpense(page, totalPages, objDate);
  } catch (err) {
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
  prevButton.addEventListener("click", () =>
    showExpense(date, currentPage - 1)
  );

  const pageText = document.createElement("span");
  pageText.className = "page-number";
  pageText.textContent = `Page ${currentPage} of ${totalPages}`;

  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () =>
    showExpense(date, currentPage + 1)
  );

  container.appendChild(prevButton);
  container.appendChild(pageText);
  container.appendChild(nextButton);
}

updateDateDisplayExpense();

// expense monthly
const dateElementMonthly = document.querySelector("#monthlyListDate");
const monthlyList = document.querySelector("#expenseMonthlyList");
const prevMonthBtn = document.querySelector("#prevMonthBtn");
const nextMonthBtn = document.querySelector("#nextMonthBtn");

let currentDateMonthly = new Date();
const option = { month: "long", year: "numeric" };
function updateDateDisplayExpenseMonthly() {
  dateElementMonthly.textContent = currentDateMonthly.toLocaleDateString(
    "en-GB",
    option
  );
  showMonthlyExpense(currentDateMonthly);
}

prevMonthBtn.addEventListener("click", () => {
  currentDateMonthly.setMonth(currentDateMonthly.getMonth() - 1);
  updateDateDisplayExpenseMonthly();
});

nextMonthBtn.addEventListener("click", () => {
  currentDateMonthly.setMonth(currentDateMonthly.getMonth() + 1);
  updateDateDisplayExpenseMonthly();
});

const expenseMonthlyTableBody = document.querySelector(
  "#expenseMonthlyTableBody"
);

async function showMonthlyExpense(objDate, page = 1, limit = 10) {
  const date = new Date(objDate).toISOString().split("T")[0];

  try {
    const response = await axios.get(
      `/api/showMonthlyExpense?date=${date}&page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { expenses, totalPages } = response.data;
    expenseMonthlyTableBody.innerHTML = "";

    let totalCredit = 0;
    let totalDebit = 0;

    // Group by date
    const groupedByDate = {};

    expenses.forEach((expense) => {
      const expDate = new Date(expense.createdAt).toISOString().split("T")[0];
      if (!groupedByDate[expDate]) groupedByDate[expDate] = [];
      groupedByDate[expDate].push(expense);
    });

    for (const [date, dayExpenses] of Object.entries(groupedByDate)) {
      dayExpenses.forEach((expense, index) => {
        const row = document.createElement("tr");

        if (expense.amountType === "credit") {
          row.style.color = "green";
          totalCredit += parseInt(expense.amount);
        } else if (expense.amountType === "debit") {
          row.style.color = "red";
          totalDebit += parseInt(expense.amount);
        }

        row.innerHTML = `
          <td>${index === 0 ? date : ""}</td>
           <td>${expense.amountType}</td>
          <td>${expense.description}</td>
          
          <td>${expense.amount}</td>
         
        `;

        expenseMonthlyTableBody.appendChild(row);
      });
    }

    totalExpense.textContent = "Total Expense: " + totalDebit;
    totalIncome.textContent = "Total Income: " + totalCredit;
    overAllBalance.textContent = "Balance: " + (totalCredit - totalDebit);
  } catch (err) {
    console.error(err);
  }
}

updateDateDisplayExpenseMonthly();

// expense yearly
const dateElementYearly = document.querySelector("#yearlyListDate");

let currentDateYearly = new Date();
const options = { year: "numeric" };
function updateDateDisplayExpenseYearly() {
  dateElementYearly.textContent = currentDateYearly.toLocaleDateString(
    "en-GB",
    options
  );
  showYearlyExpense(currentDateYearly);
}

prevYearBtn.addEventListener("click", () => {
  currentDateYearly.setFullYear(currentDateYearly.getFullYear() - 1);
  updateDateDisplayExpenseYearly();
});

nextYearBtn.addEventListener("click", () => {
  currentDateYearly.setFullYear(currentDateYearly.getFullYear() + 1);
  updateDateDisplayExpenseYearly();
});

const yearlyExpenseTableBody = document.querySelector(
  "#yearlySummaryTableBody"
);

async function showYearlyExpense(objDate) {
  const date = new Date(objDate).toISOString().split("T")[0];

  try {
    const response = await axios.get(`/api/showYearlyExpense?date=${date}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { expenses } = response.data;
    yearlyExpenseTableBody.innerHTML = "";

    const monthlySummary = {};

    expenses.forEach((exp) => {
      const monthIndex = new Date(exp.createdAt).getMonth();
      const monthName = new Date(exp.createdAt).toLocaleString("default", {
        month: "long",
      });

      if (!monthlySummary[monthIndex]) {
        monthlySummary[monthIndex] = { monthName, income: 0, expense: 0 };
      }

      if (exp.amountType === "credit") {
        monthlySummary[monthIndex].income += parseFloat(exp.amount);
      } else if (exp.amountType === "debit") {
        monthlySummary[monthIndex].expense += parseFloat(exp.amount);
      }
    });

    const sortedMonths = Object.keys(monthlySummary).sort((a, b) => a - b);

    sortedMonths.forEach((monthIndex) => {
      const { monthName, income, expense } = monthlySummary[monthIndex];
      const balance = income - expense;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${monthName}</td>
        <td style="color:green">₹ ${income.toFixed(2)}</td>
        <td style="color:red">₹ ${expense.toFixed(2)}</td>
        <td><strong>₹ ${balance.toFixed(2)}</strong></td>
      `;
      yearlyExpenseTableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Error fetching yearly summary:", err);
  }
}

updateDateDisplayExpenseYearly();

// buy premium
premiumBtn.addEventListener("click", async () => {
  try {
    const response = await axios.get("/api/purchase/premium", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { order_id, payment_session_id } = response.data;

    console.log("received payment_session_id: ", response.data);

    cashfree.checkout({
      paymentSessionId: payment_session_id,
      redirectTarget: "_blank",
    });

    setTimeout(() => {
      let attempts = 0;
      const maxAttempts = 5;

      const pollInterval = setInterval(async () => {
        attempts++;
        const status = await checkPaymentStatus(order_id, payment_session_id);

        if (status === "SUCCESSFUL" || attempts >= maxAttempts) {
          clearInterval(pollInterval);
        }
      }, 5000);
    }, 10000);
  } catch (err) {
    console.error("Error initiating purchase:", err);
    alert("Something went wrong. Please try again.");
  }
});

async function checkPaymentStatus(orderId, sessionId) {
  try {
    const statusResponse = await axios.get(
      `/api/purchase/premium/${orderId}/${sessionId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const status = statusResponse.data.status;
    console.log("Payment status:", status);

    if (status === "SUCCESSFUL") {
      premiumBtn.classList.add("hidden");
      userName.textContent = `${localStorage.getItem(
        "username"
      )} (premium user)`;
      alert("Congratulations, you're now a Premium user!");
    } else {
      console.log("Still pending or failed.");
    }

    return status;
  } catch (err) {
    console.error("Error checking payment status:", err);
    return "FAILED";
  }
}

// leader Board section

if (isPremium) {
  leaderboardBtn.addEventListener("click", () => {
    header2Section.classList.add("hidden");
    expenseSection.classList.add("hidden");
    leaderBoardSection.classList.remove("hidden");
    buyPremiumSection.classList.add("hidden");
    todoSection.classList.add("hidden");
    monthlyExpenseSection.classList.add("hidden");
    yearlyExpenseSection.classList.add("hidden");

    showLeaderboard();
  });
}

// show leaderboard function

async function showLeaderboard() {
  try {
    
    const response = await axios.get("/api/premium/showleaderboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const leaderboard = response.data.data;
    const leaderboardList = document.querySelector("#leaderboardList");

    // Clear existing list
    leaderboardList.innerHTML = "";

    // Create table structure
    const table = document.createElement("table");
    table.className = "leaderboard-table";

    // Add table header
    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>Rank</th>
        <th>Name</th>
        <th>Total Expense</th>
        </tr>
            `;
    table.appendChild(thead);

    // Add table body
    const tbody = document.createElement("tbody");

    leaderboard.forEach((user, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.name}</td>
        <td>₹${parseFloat(user.totalExpense).toFixed(2)}</td>
          `;
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    leaderboardList.appendChild(table);
  } catch (err) {
    console.error("Error fetching leaderboard data:", err);
    alert("Failed to load leaderboard data. Please try again.");
  }
}


// PDF buttons
const viewPdfMonthlyBtn = document.querySelector('#viewPdfMonthlyBtn');
const viewPdfYearlyBtn  = document.querySelector('#viewPdfYearlyBtn');

[viewPdfMonthlyBtn, viewPdfYearlyBtn].forEach(btn => {
  // disable if not premium
  if (!isPremium) btn.disabled = true;

  // navigate to /pdf
  btn.addEventListener('click', () => {
    // optionally pass a query to pre-select daily/monthly/yearly in pdf.html
    window.location.href = '/pdf';
  });
});