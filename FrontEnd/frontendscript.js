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
    const expenseList = document.getElementById('expenseList');

    expenses.forEach((expense) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Category: ${expense.category}, Description: ${expense.description}, Amount: ${expense.amount}, Created At: ${expense.createdAt}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', async () => {
            const response = await axios.post('http://localhost:4000/expense/deleteexpense', {
               ID: expense.id
            });
            if (response.status === 200) {
                const updatedExpenses = await fetchExpense();
                if (updatedExpenses) {
                    expenseList.innerHTML = '';
                    displayExpenses(updatedExpenses);
                }
            }
        });

        listItem.appendChild(deleteButton);
        expenseList.appendChild(listItem);
    });
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
    const expenseAmount = document.getElementById('expenseAmount').value;
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