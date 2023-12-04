const selectedDate = document.getElementById('selectedDate');
        const prevDayButton = document.getElementById('prevDay');
        const nextDayButton = document.getElementById('nextDay');
        const addExpenseButton = document.getElementById('addExpense');
        const viewExpensesSelect = document.getElementById('viewExpenses');
        let currentDate = new Date();
        let isCategoryBarVisible = false;

        function displayCurrentDate() {
            const options = { year: 'numeric', month: 'long', day: '2-digit' };
            const currentFormattedDate = currentDate.toLocaleDateString('en-US', options);
            selectedDate.textContent = currentFormattedDate;
        }

        displayCurrentDate(); 

        prevDayButton.addEventListener('click', () => {
            currentDate.setDate(currentDate.getDate() - 1);
            displayCurrentDate();
        });

        nextDayButton.addEventListener('click', () => {
            currentDate.setDate(currentDate.getDate() + 1);
            displayCurrentDate();
        });

        addExpenseButton.addEventListener('click', () => {
            const categoryBar = document.getElementById('categoryBar');

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
                const options = { year: 'numeric', month: 'long', day: '2-digit' };
                const currentFormattedDate = currentDate.toLocaleDateString('en-US', options);
                selectedDate.textContent = currentFormattedDate;
            } else if (selectedView === 'monthly') {
                const options = { year: 'numeric', month: 'long' };
                const currentFormattedDate = currentDate.toLocaleDateString('en-US', options);
                selectedDate.textContent = currentFormattedDate;
            } else if (selectedView === 'yearly') {
                const options = { year: 'numeric' };
                const currentFormattedDate = currentDate.toLocaleDateString('en-US', options);
                selectedDate.textContent = currentFormattedDate;
            }
        });