export class adminLoginView extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: "open"});
        console.log("noo")
    }

    refresh() {
        this.shadow.innerHTML = `
        <span>Name<span> 
        <input id="nameInput" type="text"></input> 
        <br>
        <span>Password<span>
        <input id="passwordInput" type="password"></input>
        <br>
        `;
        
        let adminUsernameInput = this.shadow.getElementById("nameInput");
        let adminPasswordInput = this.shadow.getElementById("passwordInput");
        

        const btnLogin = document.createElement("button");
        btnLogin.innerText = "Login";
        const div = document.createElement("div");
        div.innerHTML = "Wrong password or username"
        
        this.shadow.appendChild(btnLogin);

        const correctNameAdmin = "augustus.gloop@sukkergris.no"
        const correctPasswordAdmin = "laffytaffy"
        
        
        btnLogin.addEventListener("click", (evt) => {
            if( adminUsernameInput.value == correctNameAdmin && adminPasswordInput.value == correctPasswordAdmin){
                const adminMenu = new CustomEvent("adminMenuView", {composed:true, bubbles:true});
                this.dispatchEvent(adminMenu);
                console.log("yo");
            }else{
                console.log("wrong")
                this.shadow.appendChild(div);
                
            }
        })
    
    }

}




customElements.define("admin-login-view", adminLoginView)