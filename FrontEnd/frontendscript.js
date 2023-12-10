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
    updateExpensesView(viewExpensesSelect.value);
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
    updateExpensesView(viewExpensesSelect.value);
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
    updateExpensesView(selectedView);
});

async function fetchExpenseByDate(startDate, endDate) {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:4000/expense/fetchexpense?startDate=${formattedStartDate}&endDate=${formattedEndDate}`, {
            headers: {
                'Authorization': token
            }
        });
        return response.data;
    } catch (err) {
        console.log("Failed to fetch expenses", err);
        return []; // Return an empty array or handle the error according to your app logic
    }
}

function calculateDateRange(viewType) {
    const today = new Date();
    let startDate, endDate;

    switch (viewType) {
        case 'daily':
            startDate = new Date(currentDate);
            endDate = new Date(currentDate);
            break;
        case 'monthly':
            startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            break;
        case 'yearly':
            startDate = new Date(currentDate.getFullYear(), 0, 1);
            endDate = new Date(currentDate.getFullYear(), 11, 31);
            break;
        default:
            break;
    }

    return { startDate, endDate };
}

async function updateExpensesView(viewType) {
    const { startDate, endDate } = calculateDateRange(viewType);
    const expenses = await fetchExpenseByDate(startDate, endDate);
    displayExpenses(expenses);
}

function displayExpenses(expenses) {
    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = '';

    if (expenses.length === 0) {
        const noExpensesMessage = document.createElement('p');
        noExpensesMessage.textContent = 'No expenses found for the selected period.';
        expenseList.appendChild(noExpensesMessage);
        return;
    }

    const expenseTable = document.createElement('table');
    expenseTable.classList.add('expense-table');

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

    const tableBody = document.createElement('tbody');

    expenses.forEach((expense) => {
        const row = document.createElement('tr');

        const categoryCell = document.createElement('td');
        categoryCell.textContent = expense.category;
        row.appendChild(categoryCell);

        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = expense.description;
        row.appendChild(descriptionCell);

        const amountCell = document.createElement('td');
        amountCell.textContent = expense.amount;
        row.appendChild(amountCell);

        const createdAtCell = document.createElement('td');
        const date = new Date(expense.createdAt);
        const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        createdAtCell.textContent = formattedDate;
        row.appendChild(createdAtCell);

        const deleteButtonCell = document.createElement('td');
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
                updateExpensesView(viewExpensesSelect.value);
            }
        });
        deleteButtonCell.appendChild(deleteButton);
        row.appendChild(deleteButtonCell);

        tableBody.appendChild(row);
    });

    expenseTable.appendChild(tableBody);
    expenseList.appendChild(expenseTable);
}

updateExpensesView(viewExpensesSelect.value);


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