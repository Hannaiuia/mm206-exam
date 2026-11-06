export class adminMenuView extends HTMLElement {

    //-----------------------------
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: "open"});
        console.log("pooaol")
    }

    connectedCallback(){
        this.refresh();
    }
  
    refresh(){

        
        this.shadow.innerHTML = "";

        const btnProducts = document.createElement("button");
        const btnOrders = document.createElement("button");
        const btnUsers = document.createElement("button");
        const btnUserCom = document.createElement("button");

        btnProducts.innerText = "Products";
        btnOrders.innerText = "Orders";
        btnUsers.innerText = "Users";
        btnUserCom.innerText = "User comments/reviews"

        this.shadow.appendChild(btnProducts);
        this.shadow.appendChild(btnOrders);
        this.shadow.appendChild(btnUsers);
        this.shadow.appendChild(btnUserCom);

        btnProducts.addEventListener("click", function(evt){
            const adminProductView = new CustomEvent("adminProdView", {composed: true, bubbles:true});
            this.dispatchEvent(adminProductView);
        })

        btnOrders.addEventListener("click", function(evt){
            const adminOrdersView = new CustomEvent("adminOrderView", {composed:true, bubbles:true});
            this.dispatchEvent(adminOrdersView);
        })
    }
}
customElements.define("admin-menu", adminMenuView);
