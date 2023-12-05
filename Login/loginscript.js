document.getElementById('signup').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = '../SignUp/SignUp.html';
  });
  
  let form = document.getElementById('form');
  
  form.addEventListener('submit', function(event) {
    event.preventDefault();
  
    if (event.submitter.id === 'login') {
      login(); 
    }
  });
  
  async function fetchUsers() {
    try {
      const response = await axios.get('http://localhost:4000/users/fetchusers');
      return response.data;
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data");
    }
  }
  
  async function login() {
    let email = document.getElementById('email').value;
    let pass = document.getElementById('pass').value;
  
    try {
        const response = await axios.post('http://localhost:4000/users/login', {
            email: email,
            pass: pass,
            completed: false
          }, {
            validateStatus: function (status) {
              return status >= 200 && status < 500; // Resolve only if status is between 200 and 499
            }
          });
          
          if (response.status === 200) {
            alert(response.data.message);
            window.location.href = '../FrontEnd/expense.html?email=' + email;
          } else if (response.status === 404) {
            alert('Invalid email or password'); 
          } else {
            alert('Some other error occurred');
          }

    document.getElementById('email').value = "";
    document.getElementById('pass').value = "";

  } catch (err) {
    console.error(err);
    alert("Failed to store data");
  }}
  