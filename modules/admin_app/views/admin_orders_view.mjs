export class AdminOrdersView extends HTMLElement {

    //-----------------------------

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: "open"});
        console.log("Orders View")
    }

    //------------------------------

    refresh(data) {

       if (!data) {return}

        this.shadow.innerHTML = "";

        const btnMenu = document.createElement("button")
        btnMenu.innerHTML = "Menu"

        this.shadow.appendChild(btnMenu)

        //------------------------------------

        btnMenu.addEventListener("click", async function(evt) {
            const backToMenuEvent = new CustomEvent('backToMenuBtn', {composed:true, bubbles:true})
            this.dispatchEvent(backToMenuEvent);
        })

        //------------------------------------

        for(let value of data){

            const div = document.createElement("div");
            const btnDeletOrders = document.createElement("button");
            let orderId = value.id;
            btnDeletOrders.innerHTML = "Delete order"

            //---------------------------------

            div.innerHTML = `
                <hr>
                <h2>Order #${value.id}</h2>
                <p>Customer: ${value.customer_name}</p>
                <p>Email: ${value.email}</p>
                <p>Address: ${value.street}</p>
                <p>City: ${value.city}</p>
                <p>Zipcode: ${value.zipcode}</p>
                <p>Country: ${value.country}</p>
                `;

            //------------------------------------

            btnDeletOrders.addEventListener("click", async function(evt) {
                const deleteOrder = new CustomEvent('deleteOrder', {composed:true, bubbles:true, detail:orderId})
                this.dispatchEvent(deleteOrder);
            })

            //-------------------------------------
            
            this.shadow.appendChild(div);
            this.shadow.appendChild(btnDeletOrders);
        }


    }
}

customElements.define("orders-view", AdminOrdersView);