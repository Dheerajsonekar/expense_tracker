const loginForm = document.getElementById("loginForm");
const signUpForm = document.getElementById('signupForm');

signUpForm.addEventListener('submit', async (e)=>{
    e.preventDefault();

    const user = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }

   

    try{
     await axios.post('http://localhost:3000/api/signUp', user)
     signUpForm.reset();
    //  console.log("registered successfully")
    }catch(err){
        console.log("registrationForm error at submit: ", err);
    }
})

loginForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
  
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    
    try{
        const response = await axios.post("http://localhost:3000/api/login", {email, password});
        

        if(response.status === 200){
            
            
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", response.data.name );
            
            window.location.href ='/expense.html'
        }
    }catch(err){
        console.error(err);
    }
    

})






