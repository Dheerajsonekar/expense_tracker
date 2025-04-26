const form = document.getElementById("logInForm");

form.addEventListener("submit", async (e)=>{
    e.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    
    try{
        await axios.post("http://localhost:3000/api/login", {email, password});
        form.reset();
    }catch(err){
        console.error(err);
    }
    

})


