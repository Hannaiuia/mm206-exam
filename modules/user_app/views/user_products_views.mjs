export class CategoryView extends HTMLElement{
    //----------------------------------------
    constructor(){
        super(); //calls constructor of parent(HTMLelement)
        this.shadow = this.attachShadow({mode: "open"});
    }

    //----------------------------------------
    refresh(data){
        if(!data) {return} //if an error is catched in api_services

        this.shadow.innerHTML = "";

        for(let value of data){

            const div = document.createElement("div"); 
            div.innerHTML = `
                <h2>${value.catName}</h2>
                <p>${value.catDescr}</p><hr>               
            `;
            this.shadow.appendChild(div); 

            div.addEventListener(`click`, evt => {
                const catEvt = new CustomEvent("categoryselect", {composed: true, bubbles:true }); 
                catEvt.categoryData = value; 
                this.shadow.dispatchEvent(catEvt); 
            }); 
        }
    }
}
//==============================================
export class ListView extends HTMLElement{
    //------------------------------------------
    constructor(){
        super(); 
        this.shadow = this.attachShadow({mode: "open"});
    }

    refresh(data){
        if(!data) {return} //if an error is catched in api_services

        this.shadow.innerHTML = ""; 
        for(let value of data) {
            const div = document.createElement("div"); 

            div.innerHTML = `
                <h2>${value.name}</h2> 
                <img src = "https://sukkergris.onrender.com/images/GFTPOE21/small/${value.thumb}">
                <br>
                <p>kr ${value.price}-</p><hr>
            `;
            this.shadow.appendChild(div); 

            div.addEventListener(`click`, evt => {
                const productsEvt = new CustomEvent("productclick", {composed: true, bubbles:true }); 
                productsEvt.productData = value; 
                this.shadow.dispatchEvent(productsEvt); 
            }); 
        }

        const backBtn = document.createElement("button");
        backBtn.innerText = "Go back...";
        this.shadow.appendChild(backBtn);

        backBtn.addEventListener('click',evt => {
            const listBack = new CustomEvent("backclick", {composed: true, bubbles: true})
            this.dispatchEvent(listBack);        
        });
    }
}
//================================================
export class DetailView extends HTMLElement{
    //--------------------------------------
    constructor(){
        super(); 
        this.shadow = this.attachShadow({mode: "open"}); 
    }

    refresh(data){
        if(!data) {return}
        this.shadow.innerHTML = ""; 
        
        this.shadowRoot.innerHTML = `
            <h2>${data.name}</h2>
            <h2> ${this.formatSale(data)} </h2>
            <img src = "https://sukkergris.onrender.com/images/GFTPOE21/large/${data.image}">
            <br>
            <h3> ${this.formatStock(data)} </h3>
            <p> Category: ${data.catName} </p>
            <p> ${data.descr} </p>
            <br>
            <h3> ${this.formatPrice(data)}</h3>
            <p> ${this.formatRating(data)} </p>
            `; 

        const backBtn = document.createElement("button");
        backBtn.innerText = "Go back...";
        this.shadow.appendChild(backBtn);

        backBtn.addEventListener('click',evt => {
            const productBack = new CustomEvent("backclick", {composed: true, bubbles:true})
            this.dispatchEvent(productBack);        
        });

        const buyProdBtn = document.createElement("button"); 
        buyProdBtn.innerText = "Buy Product"; 
        this.shadow.appendChild(buyProdBtn); 

        buyProdBtn.addEventListener(`click`, evt =>{
            const buyProduct = new CustomEvent("buyProdClick", {composed: true, bubbles: true})
            this.dispatchEvent(buyProduct); 
            console.log("added product"); 
        })
    }

    //---------------format methods-------------------------------------
    formatPrice(data){
        if (data.sale > 0){
            let newPrice = ""; 
            newPrice = Math.round(data.price * (1- (data.sale/100))); 
            return "Original price:" + data.price + ",-kr New price: " + newPrice + ",-kr"; 
        }else{
            return "Price: " + data.price +  ",-kr"; 
        }}

    formatSale(data){
        if (data.sale > 0){
            return "The product is on " + data.sale + " % sale "; 
        }else{
            return ""; 
        }
    }

    formatStock(data){
        if(data.stock < 1){
            let delivery = new Date(data.delivery).toLocaleDateString("en-GB", { day: "numeric", month: "numeric", year: "numeric"})
            let deliveryMsg = "The product is not in stock at the moment. The item will therfor arrive at " + delivery ;
            return deliveryMsg; 
        }else{
            return "Stock: " + data.stock; 
        }}

    formatRating(data){
        if(data.rating == null){
            return "Note! The item has not been rated yet! "; 
        }else{
            return "Rating: " + data.rating; 
        }}
}

//================================================
customElements.define("cat-view", CategoryView); 
customElements.define("prod-view", ListView);
customElements.define("detail-view", DetailView);