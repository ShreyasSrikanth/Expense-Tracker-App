const premiumButton = document.getElementById('premiumButton');
const leaderBoard = document.getElementById('leaderBoard');
const premium = document.getElementById('premium');


const ispremiumuser = localStorage.getItem('ispremiumuser');
if(ispremiumuser === 'true'){
    premiumButton.style.display='none';

    let paragraph = document.createElement('p');
    const text = document.createTextNode('You are a premium user');
                    
    paragraph.appendChild(text);
    premium.appendChild(paragraph);
}

async function fetchUsers() {
    try {
      const response = await axios.get('http://localhost:4000/users/fetchusers');
      return response.data;
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data");
    }
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

leaderBoard.addEventListener('click',async()=>{
    let users = await fetchUsers()
    let expenses = await fetchAllexpense()

    console.log('users => ', users);
    console.log('expenses => ', expenses);

    users.forEach(user => {
        let amount = 0
        expenses.forEach(expense=>{
            if(user.id === expense.UserId){
                amount = amount + expense.amount;
            }
            console.log(user.name," and ",amount)
        })
    });
})

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
