//this module handles info-messages to the user, e.g., shows a dialog when you have logged in successfully, added an order etc
// ---------------------------------------
export function showMessage(msg){
        // show messages here, e.g. show a dialog/view with an easy-to-understand message
        //const message = document.createElement("p");
        //message.textContent = msg;
        //document.body.appendChild(message);
        alert(msg); 
        console.log(msg); 
}