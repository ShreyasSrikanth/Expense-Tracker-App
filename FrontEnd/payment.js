const premiumButton = document.getElementById('premiumButton');

premiumButton.addEventListener('click', async (e) => {
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
