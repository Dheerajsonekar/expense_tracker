const form = document.getElementById("logInForm");

form.addEventListener("submit", async (e)=>{
    e.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log(email, password);
    try{
        await axios.post("http://localhost:3000/api/user/login", {email, password});
        form.reset();
    }catch(err){
        console.error(err);
    }
    

})


