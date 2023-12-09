let form = document.getElementById('form');

form.addEventListener('submit', async (e) =>{
    e.preventDefault();

    let email = document.getElementById('email').value;

    const response = await axios.post('http://localhost:4000/users/forgotpassword', {
        email: email,
    });

    if(response.status === 200){
        window.location.href = '../Login/Login.html'
    } else {
        alert("email not registered with us");
    }
})
