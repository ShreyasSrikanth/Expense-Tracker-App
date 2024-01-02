let resetform = document.getElementById('resetform');
const urlParams = new URLSearchParams(window.location.search);
const requestId = urlParams.get('requestId');
const token = localStorage.getItem('token');

resetform.addEventListener('submit', async (e) => {
    e.preventDefault();

    let resetPassword = document.getElementById('password').value;
     
    const response = await axios.post('http://54.162.115.208:4000/password/reset', {
        newPassword: resetPassword,
        requestId: requestId
    }, {
        headers: {
            'Authorization': token 
        }
    });
});