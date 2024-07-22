const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const transactionList = document.getElementById("transaction-list");
const form = document.getElementById("form");
const description = document.getElementById("Description");
const amount = document.getElementById("Amount");
const date = document.getElementById("date");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// add transaction
function addTransaction(e) {
  e.preventDefault();

  if (description.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add description and amount");
  } else {
    const transaction = {
      id: generateID(),
      description: description.value,
      amount: +amount.value,
      date: date.value,
    };
    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    description.value = "";
    amount.value = "";
  }
}

// generate ID
function generateID() {
  return Math.floor(Math.random() * 1000000);
}

// add transaction to DOM list
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
  item.innerHTML = `${transaction.description}
<span>${sign}${Math.abs(transaction.amount)}
</span>

<span>${transaction.date}</span>

<button class="delete-btn"
onclick="removeTransaction(${transaction.id})">❌</button>

`;

  transactionList.appendChild(item);
}

// update the balance, income and expenses
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const totalIncome = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const totalExpense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);
  balance.innerText = `$${total}`;
  income.innerText = `$${totalIncome}`;
  expense.innerText = `$${totalExpense}`;

  if (total > 0) {
    balance.style.color = "green";
  } else if (total == 0) {
    balance.style.color = "black";
  } else {
    balance.style.color = "red";
  }
}

// remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  init();
}

// update local storage transactions
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// init app
function init() {
  transactionList.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

form.addEventListener("submit", addTransaction);
init();

// hide and show history content
document.getElementById("content").addEventListener("click", () => {
  const option = document.getElementById("transaction-list");
  if (option.style.display === "none" || option.style.display === "") {
    option.style.display = "block";
    content.textContent = "History v";
  } else {
    option.style.display = "none";
    content.textContent = "History >";
  }
});
