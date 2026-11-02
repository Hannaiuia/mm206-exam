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
            //console.log("Category received by view:", value);
            //console.log("Category name:", value.catName);

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
            //console.log("Rendered HTML:", this.shadow.innerHTML);
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
        let sale = "";  
        let showSale = ""; 
        let delivery = "";
        let deliveryMsg = ""; 

        if (data.sale > 0){
            sale = data.sale; 
            showSale = "Product is on " + sale + " % "; 
        } 

        if(data.stock < 1){
            delivery = new Date(data.delivery).toLocaleDateString("en-GB", { day: "numeric", month: "numeric", year: "numeric"})
            deliveryMsg = "The product is not in stock at the moment. The item will therfor arrive at " + delivery ;
        }
        
        this.shadowRoot.innerHTML = `
            <h2>${data.name}</h2>
            <h2> ${showSale} </h2>
            <img src = "https://sukkergris.onrender.com/images/GFTPOE21/large/${data.image}">
            <br>
            <p> Category: ${data.catName} </p>
            <p> Stock: ${data.stock} </p>
            <h3> ${deliveryMsg} </h3>
            <p> ${data.descr} </p>
            <p>kr ${data.price}-</p>
            <p> Number of ratings 1-5: </p>
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
 }


//================================================
customElements.define("cat-view", CategoryView); 
customElements.define("prod-view", ListView);
customElements.define("detail-view", DetailView);