const selectedDate = document.getElementById('selectedDate');
const prevDayButton = document.getElementById('prevDay');
const nextDayButton = document.getElementById('nextDay');
const addExpenseButton = document.getElementById('addExpense');
const viewExpensesSelect = document.getElementById('viewExpenses');
const expDropdownSelect = document.getElementById('expDropdown');
const downloadButton = document.getElementById('downloadExpense');

const nextExpense = document.getElementById('nextExpense');
const prevExpense = document.getElementById('prevExpense');


const urlParams = new URLSearchParams(window.location.search);
const userEmail = urlParams.get('email');


let currentDate = new Date();
let isCategoryBarVisible = false;

var fetchDate;


function displayCurrentDate() {
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    const currentFormattedDate = currentDate.toLocaleDateString('en-US', options);
    selectedDate.textContent = currentFormattedDate;

    const dateString = currentFormattedDate;
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    fetchExpense(day)
    .then(res => {
        if (res) {
            displayExpenses(res);
        }
    })
    .catch(err => {
        console.log('Error fetching Information', err);
    });
}

function displayCurrentMonth() {
    const options = { year: 'numeric', month: 'long' };
    const currentFormattedDate = currentDate.toLocaleDateString('en-US', options);
    selectedDate.textContent = currentFormattedDate;

    const dateString = currentFormattedDate;
    const date = new Date(dateString);
    const month = date.getMonth()+1;
    const year = date.getFullYear();

    fetchExpense(month)
    .then(res => {
        if (res) {
            displayExpenses(res);
        }
    })
    .catch(err => {
        console.log('Error fetching Information', err);
    });
}

function displayCurrentYear() {
    const options = { year: 'numeric' };
    const currentFormattedDate = currentDate.toLocaleDateString('en-US', options);
    selectedDate.textContent = currentFormattedDate;
    const dateString = currentFormattedDate;
    const date = new Date(dateString);
    const month = date.getMonth();
    const year = date.getFullYear();

    fetchExpense(year)
    .then(res => {
        if (res) {
            displayExpenses(res);
        }
    })
    .catch(err => {
        console.log('Error fetching Information', err);
    });
}

displayCurrentDate();



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

async function fetchExpense(currentFormattedDate){
    try {
        let start = 0;
        let limit = parseInt(document.getElementById('expDropdown').value);

        const expDropdownSelect = document.getElementById('expDropdown');
        expDropdownSelect.addEventListener('change', async (event) => {
            limit = parseInt(event.target.value);
            await axios.get(`http://localhost:4000/expense/fetchexpense/${currentFormattedDate}?start=${start}&limit=${limit}`, {
            headers: {
                'Authorization': token
            }
        }).then(res=>{
            displayExpenses(res.data);
        })
        });
        
        nextExpense.addEventListener('click', async ()=>{
            start = start + limit;
            await axios.get(`http://localhost:4000/expense/fetchexpense/${currentFormattedDate}?start=${start}&limit=${limit}`, {
            headers: {
                'Authorization': token
            }
        }).then(res=>{
            displayExpenses(res.data);
        })
        })

        prevExpense.addEventListener('click',async ()=>{

            start = start - limit;
            if(start >= 0){
                await axios.get(`http://localhost:4000/expense/fetchexpense/${currentFormattedDate}?start=${start}&limit=${limit}`, {
                headers: {
                    'Authorization': token
                }
                }).then(res=>{
                        displayExpenses(res.data);
                })
            } else {
                start = 0;
            }
            
        })

        
        
        var token = localStorage.getItem('token')
        const response = await axios.get(`http://localhost:4000/expense/fetchexpense/${currentFormattedDate}?start=${start}&limit=${limit}`, {
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

downloadButton.addEventListener('click', async(e) =>{
    e.preventDefault();

    try {
        var token = localStorage.getItem('token')
        const response = await axios.get(`http://localhost:4000/expense/download`, {
            headers: {
                'Authorization': token
            }
        });
        const { fileUrl, success } = response.data;

        var a = document.createElement('a');
        a.href =fileUrl;
        a.download = 'expense.csv';
        a.click();

        const allUrls = await axios.get(`http://localhost:4000/expense/urls`, {
            headers: {
                'Authorization': token
            }
        });

        const { urls } = allUrls.data

        const urlList = document.getElementById('urlList');
        urlListHeader = document.getElementById('urlListHeader');
        urlListHeader.textContent = "List of Previously fetched Urls"

        urls.forEach( url =>{
            console.log('allurls ----->', url.fileUrl);
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = url.fileUrl;
            link.textContent = url.fileUrl;
            link.target = '_blank'; // Open links in a new tab/window
            listItem.appendChild(link);
            urlList.appendChild(listItem);
        })
    } catch(err){
        console.log("Failed to fetch expenses",err)
    }
    
})