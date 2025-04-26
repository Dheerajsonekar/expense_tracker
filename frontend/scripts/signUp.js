const registrationForm = document.getElementById('registrationForm');


registrationForm.addEventListener('submit', async (e)=>{
    e.preventDefault();

    const user = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }

    console.log(user);

    try{
     await axios.post('http://localhost:3000/api/signUp', user)
     registrationForm.reset();
     console.log("registered successfully")
    }catch(err){
        console.log("registrationForm error at submit: ", err);
    }
})