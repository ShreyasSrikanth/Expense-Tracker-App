let form = document.getElementById('form');

form.addEventListener('submit',sendSignUp);

async function fetchUsers(){
    try {
        const response = await axios.get('http://localhost:4000/users/fetchusers');

        return response.data;

    } catch (err) {
        console.error(err);
        alert("Failed to store data");
    }
}

async function sendSignUp(e){
    e.preventDefault();

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let pass = document.getElementById('pass').value;

    console.log(name);
    console.log(email);
    console.log(pass);

    var displayUsers = await fetchUsers();
    

    const emailExists = displayUsers.some(element => element.email === email);

    if(emailExists){
        alert('Email already registered');
        return; // Stop further execution
    }

    try {
        const response = await axios.post('http://localhost:4000/users/signup', {
            name: name,
            email: email,
            pass: pass,
            completed: false
        });

        alert("data succefully stored");

        document.getElementById('name').value = "";
        document.getElementById('email').value = "";
        document.getElementById('pass').value = "";

    } catch (err) {
        console.error(err);
        alert("Failed to store data");
    }
}