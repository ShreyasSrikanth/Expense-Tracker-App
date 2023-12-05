const premiumButton = document.getElementById('premiumButton');

premiumButton.addEventListener('click',async (e) => {
    console.log('Your a premium member');
    var token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:4000/premium/premiummembership', {
        headers: {
            'Authorization': token
        }
    });
    console.log(response);

    var options = 
    {
        "key" : response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            await axios.post('http://localhost:4000/premium/updateTransaction', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: { 'Authorization': token } });
            alert('You are a premium user');
        }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();

    rzp1.on('payment_failed',function (response){
        console.log(response);
        alert('Something went wrong')
    })
})