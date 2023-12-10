const selectedDate = document.getElementById('selectedDate');
const prevDayButton = document.getElementById('prevDay');
const nextDayButton = document.getElementById('nextDay');
const addExpenseButton = document.getElementById('addExpense');
const viewExpensesSelect = document.getElementById('viewExpenses');

const urlParams = new URLSearchParams(window.location.search);
const userEmail = urlParams.get('email');
console.log('email',userEmail);

let currentDate = new Date();
let isCategoryBarVisible = false;

function displayCurrentDate() {
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    const currentFormattedDate = currentDate.toLocaleDateString('en-US', options);
    selectedDate.textContent = currentFormattedDate;
}

function displayCurrentMonth() {
    const options = { year: 'numeric', month: 'long' };
    const currentFormattedDate = currentDate.toLocaleDateString('en-US', options);
    selectedDate.textContent = currentFormattedDate;
}

function displayCurrentYear() {
    const options = { year: 'numeric' };
    const currentFormattedDate = currentDate.toLocaleDateString('en-US', options);
    selectedDate.textContent = currentFormattedDate;
}

displayCurrentDate();

prevDayButton.addEventListener('click', () => {
    if (viewExpensesSelect.value === 'daily') {
        currentDate.setDate(currentDate.getDate() - 1);
        displayCurrentDate();
    } else if (viewExpensesSelect.value === 'monthly') {
        currentDate.setMonth(currentDate.getMonth() - 1);
        displayCurrentMonth();
    } else if (viewExpensesSelect.value === 'yearly') {
        currentDate.setFullYear(currentDate.getFullYear() - 1);
        displayCurrentYear();
    }
});

nextDayButton.addEventListener('click', () => {
    if (viewExpensesSelect.value === 'daily') {
        currentDate.setDate(currentDate.getDate() + 1);
        displayCurrentDate();
    } else if (viewExpensesSelect.value === 'monthly') {
        currentDate.setMonth(currentDate.getMonth() + 1);
        displayCurrentMonth();
    } else if (viewExpensesSelect.value === 'yearly') {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        displayCurrentYear();
    }
});

const categoryBar = document.getElementById('categoryBar');

addExpenseButton.addEventListener('click', () => {
    if (!isCategoryBarVisible) {
        categoryBar.style.display = 'flex';
        isCategoryBarVisible = true;
    } else {
        categoryBar.style.display = 'none';
        isCategoryBarVisible = false;
    }
});

viewExpensesSelect.addEventListener('change', () => {
    const selectedView = viewExpensesSelect.value;
    if (selectedView === 'daily') {
        displayCurrentDate();
    } else if (selectedView === 'monthly') {
        displayCurrentMonth();
    } else if (selectedView === 'yearly') {
        displayCurrentYear();
    }
});

async function fetchExpense(){
    try {
        var token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:4000/expense/fetchexpense', {
        headers: {
            'Authorization': token
        }
    });

    return response.data

    } catch(err){
        console.log("Failed to fetch expenses",err)
    }
}

function displayExpenses(expenses) {
    const expenseTable = document.createElement('table');
    expenseTable.classList.add('expense-table');

    // Create table header
    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headerCategories = ['Category', 'Description', 'Amount', 'Created At', 'Delete'];
    headerCategories.forEach((category) => {
        const headerCell = document.createElement('th');
        headerCell.textContent = category;
        headerRow.appendChild(headerCell);
    });
    tableHeader.appendChild(headerRow);
    expenseTable.appendChild(tableHeader);

    // Create table body
    const tableBody = document.createElement('tbody');
    expenses.forEach((expense) => {
        const row = document.createElement('tr');

        // Category cell
        const categoryCell = document.createElement('td');
        categoryCell.textContent = expense.category;
        row.appendChild(categoryCell);

        // Description cell
        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = expense.description;
        row.appendChild(descriptionCell);

        // Amount cell
        const amountCell = document.createElement('td');
        amountCell.textContent = expense.amount;
        row.appendChild(amountCell);

        // Created At cell
        const createdAtCell = document.createElement('td');
        const dateString = expense.createdAt;
        const date = new Date(dateString);
        const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        createdAtCell.textContent = formattedDate;
        row.appendChild(createdAtCell);

        // Delete button cell
        const deleteButtonCell = document.createElement('td');
        deleteButtonCell.classList.add('delete-cell');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', async () => {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:4000/expense/deleteexpense', {
                ID: expense.id,
                amount: expense.amount
            }, {
                headers: {
                    'Authorization': token
                }
            });
            if (response.status === 200) {
                const updatedExpenses = await fetchExpense();
                if (updatedExpenses) {
                    expenseTable.innerHTML = '';
                    displayExpenses(updatedExpenses);
                }
            }
        });
        deleteButtonCell.appendChild(deleteButton);
        row.appendChild(deleteButtonCell);

        tableBody.appendChild(row);
    });
    expenseTable.appendChild(tableBody);

    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = '';
    expenseList.appendChild(expenseTable);
}


    fetchExpense()
    .then(res => {
        if (res) {
            displayExpenses(res);
        }
    })
    .catch(err => {
        console.log('Error fetching Information', err);
    });


const expenseForm = document.getElementById('expensesForm');

expenseForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const expenseCategory = document.getElementById('expenseCategory').value;
    const expenseAmountStr = document.getElementById('expenseAmount').value;
    const expenseAmount = parseFloat(expenseAmountStr);
    const expenseDescription = document.getElementById('expenseDescription').value;

    const expenseDetails = {
        category: expenseCategory,
        amount: expenseAmount,
        desc: expenseDescription
    };

    var token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:4000/expense/storeexpense', {
        category: expenseCategory,
        amount: expenseAmount,
        desc: expenseDescription,
        completed: false
    },{
        headers: {
            'Authorization': token 
        }
    });

    if (response.status === 200) {
        const updatedExpenses = await fetchExpense();
        if (updatedExpenses) {
            expenseList.innerHTML = '';
            displayExpenses(updatedExpenses);
        }
    }
    // if (response.status === 200){
        
    // } else{
    //     alert(response.data)
    // }
    

    console.log('Expense Details:', response.status);
});