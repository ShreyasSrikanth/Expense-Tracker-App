const premiumButton = document.getElementById('premiumButton');
const leaderBoard = document.getElementById('leaderBoard');
const premium = document.getElementById('premium');
const premiumTitle = document.getElementById('premiumTitle')
const expenditures = document.getElementById('expenditures');


const ispremiumuser = localStorage.getItem('ispremiumuser');
if(ispremiumuser === 'true'){
    premiumButton.style.display='none';
    leaderBoard.style.display='flex'

    let paragraph = document.createElement('p');
    const text = document.createTextNode('Premium');
                    
    paragraph.appendChild(text);
    paragraph.style.fontSize='smaller';
    paragraph.style.background = 'brown';
    paragraph.style.borderRadius = '4px';
    paragraph.style.paddingLeft = '6px';
    paragraph.style.paddingTop = '5px';
    paragraph.style.paddingBottom = '5px';
    premiumTitle.appendChild(paragraph);

    expenditures.style.background='radial-gradient(black, transparent)';
}

async function fetchAllexpense() {
    try {
      const response = await axios.get('http://localhost:4000/expense/fetchAllexpense');
      return response.data;
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data");
    }
  }

  leaderBoard.addEventListener('click', async () => {
    let expenses = await fetchAllexpense();

    const leaderboardlist = document.getElementById('leaderboardlist');
    leaderboardlist.innerHTML = '';

    expenses.forEach(expenseLeaderBoard => {
        const listItem = document.createElement('li');
        listItem.textContent = `Name: ${expenseLeaderBoard.name} , Total Expenditure: ${expenseLeaderBoard.totalExpense}` ;
        leaderboardlist.appendChild(listItem);       
    });
});


premiumButton.addEventListener('click', async (e) => {
    e.preventDefault()
    console.log('You are a premium member');
    
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/premium/premiummembership', {
            headers: {
                'Authorization': token
            }
        });

        const options = {
            "key": response.data.key_id,
            "order_id": response.data.order.id,
            "handler": async function (rzpResponse) {
                try {
                    await axios.post('http://localhost:4000/premium/updateTransaction', {
                        order_id: options.order_id,
                        payment_id: rzpResponse.razorpay_payment_id,
                    }, { headers: { 'Authorization': token } });

                    alert('You are a premium user');
                    premiumButton.style.display='none';

                    let paragraph = document.createElement('p');
                    const text = document.createTextNode('You are a premium user');
                    
                    paragraph.appendChild(text);
                    premium.appendChild(paragraph);
                } catch (err) {
                    console.error('Error updating transaction:', err);
                    alert('Failed to update transaction');
                }
            }
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();

        rzp1.on('payment_failed', function (rzpResponse) {
            console.log(rzpResponse);
            alert('Payment failed. Please try again.');
        });
    } catch (err) {
        console.error('Error:', err);
        alert('An error occurred. Please try again later.');
    }
});
