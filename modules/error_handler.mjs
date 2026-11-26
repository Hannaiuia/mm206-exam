//-----------------------------------------
export function errorHandler(error) {
    // handle errors here, e.g. show a dialog with an easy-to-understand explanation
    // based on the error type/code.
    const errormessage = document.createElement("p")
    errormessage.textContent = error;
    document.body.appendChild(errormessage); 

    setTimeout(function(){
        errormessage.remove();
    }, 4000);
     
    console.log("something went wrong:" + error); 
}