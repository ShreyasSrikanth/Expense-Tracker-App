  let form = document.getElementById('form');

  
  form.addEventListener('submit', login);
  
  document.getElementById('signup').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = '../SignUp/SignUp.html';
  });


  async function fetchUsers(){
    try {
        const response = await axios.get('http://localhost:4000/users/fetchusers');
        console.log('res-->',response)
        return response.data;

    } catch (err) {
        console.error(err);
        alert("Failed to store data");
    }
}

 async function login(){
    let email = document.getElementById('email').value;
    let pass = document.getElementById('pass').value;

    var displayUsers = await fetchUsers();

    console.log(displayUsers)

    const user = displayUsers.find(element => element.email === email);

  if (user) {
    if (user.pass === pass) {
      
      alert('Login successful!');
    } else {
      alert('Incorrect password');
    }
  } else {
    alert('User with the provided email does not exist');
  }
}

  