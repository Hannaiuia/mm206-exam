import { errorHandler } from "../../error_handler.mjs";

export class adminLoginView extends HTMLElement {

    //-----------------------------

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: "open"});
        console.log("noo")
    }

    //-----------------------------

    refresh() {
        this.shadow.innerHTML = `
        <span>Name<span> 
        <input id="nameInput" type="text"></input> 
        <br>
        <span>Password<span>
        <input id="passwordInput" type="password"></input>
        <br>
        `;

        //-----------------------------
        
        let adminUsernameInput = this.shadow.getElementById("nameInput");
        let adminPasswordInput = this.shadow.getElementById("passwordInput");   

        const btnLogin = document.createElement("button");
        btnLogin.innerText = "Login";
        const div = document.createElement("div");
        div.id = "errorMessage";
        div.hidden = true;
        div.innerHTML = "Wrong password or username";


        this.shadow.appendChild(div);
        this.shadow.appendChild(btnLogin);
       
        //-----------------------------

        btnLogin.addEventListener("click", evt => {
            let username = adminUsernameInput.value;
            let password = adminPasswordInput.value;
            const prodAdminView = new CustomEvent(`prodAdminView`,{
                composed: true, 
                bubbles:true,
                detail: {username: username, password: password}
            })
            this.dispatchEvent(prodAdminView)
        })
    }

    //-----------------------------

    errorMessage(){
        const errorMessageText = this.shadow.getElementById("errorMessage");
        errorMessageText.innerHTML = "Wrong username or password";
        errorMessageText.hidden = false;

    }

}

customElements.define("admin-login-view", adminLoginView)