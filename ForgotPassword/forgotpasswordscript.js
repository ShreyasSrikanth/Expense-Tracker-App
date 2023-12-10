let form = document.getElementById('form');
const token = localStorage.getItem('token');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let email = document.getElementById('email').value;
     

    const response = await axios.post('http://localhost:4000/password/forgotpassword', {
        email: email,
        isactive: true
    }, {
        headers: {
            'Authorization': token
        }
    });

    if (response.status === 200) {
        window.location.href = '../Login/Login.html';
    } else {
        alert("Email not registered with us");
    }
});


