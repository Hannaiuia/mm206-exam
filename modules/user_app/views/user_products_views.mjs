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
                <p> ${value.shortDescr} </p>
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
            buyProduct.productData = data;
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

//===========================================================
export class CartView extends HTMLElement{
    constructor(){
        super(); 
        this.shadow = this.attachShadow({mode: "open"});
    }

    refresh(data){
        if(!data) {return}
        this.shadow.innerHTML = ""; 

        this.shadowRoot.innerHTML = `
            <h1>Shopping Cart</h1>
            `; 
        
        const checkOutBtn = this.checkoutButton(data); 
        const emptyCartBtn = this.emptyCart(data);  

        for(let value of data) {
        const product = value.product; 
        const div = document.createElement("div"); 

        const deleteProdBtn = this.deleteButton(product);
        const plusQuantityBtn = this.incQuantityButton(product); 
        const minQuantityBtn = this.decQuantityButton(product); 


        div.innerHTML = `
            <h2>${product.name}</h2>
            <p> Product number ${product.id} </p>
            <h3> Pris kr ${this.priceForProduct(product)}</h3>
            <p> Quantity: <span class="quantity"><span class="number"></span></span> </p>
            <h3> ${this.formatStock(product)} </h3>
            `; 
            this.shadow.appendChild(div);

        const quantitySpan = div.querySelector(`.quantity`); 
        
        const numberSpan = div.querySelector(`.number`); 
        numberSpan.textContent = value.quantity; 
        
        quantitySpan.appendChild(minQuantityBtn); 
        quantitySpan.appendChild(numberSpan); 
        quantitySpan.appendChild(plusQuantityBtn); 
        
        this.shadow.appendChild(deleteProdBtn); 

        }

        const h2 = document.createElement("h2"); 
        h2.innerHTML = `
            <hr>
            <h2> Total price: ${this.calculateTotalPrice(data)} </h3></h2>
            `; 
            this.shadow.appendChild(h2); 

        this.shadow.appendChild(emptyCartBtn); 
        this.shadow.appendChild(checkOutBtn); 
    
    } 

    //--------------------------------------------------------
    formatStock(product){
        if(product.stock < 1){
            let delivery = new Date(product.delivery).toLocaleDateString("en-GB", { day: "numeric", month: "numeric", year: "numeric"})
            let deliveryMsg = "The product is not in stock at the moment. The item will therfor arrive at " + delivery ;
            return deliveryMsg; 
        }else{
            return " "; 
        }}
    //--------------------------------------------------------
    priceForProduct(data){
        if (data.sale > 0){
            let newPrice = ""; 
            newPrice = Math.round(data.price * (1- (data.sale/100))); 
            return newPrice; 
        }else{
            return data.price; 
        }}
    
    //-----------------------------------------------------------
    checkoutButton(shoppingCart){
        const checkOutBtn = document.createElement("button"); 
        checkOutBtn.innerText = "Checkout"; 

        checkOutBtn.addEventListener(`click`, evt =>{
            const checkOut = new CustomEvent("checkoutClick", {composed: true, bubbles: true})
            checkOut.productData = shoppingCart; 
            console.log("checking out"); 

            this.dispatchEvent(checkOut); 
        }); 

        return checkOutBtn; 
    }

    //---------------------------------------------------------------------
    emptyCart(shoppingCart){
        const emptyCartBtn = document.createElement("button"); 
        emptyCartBtn.innerText = "Empty cart"; 

        emptyCartBtn.addEventListener(`click`, evt =>{
            const emptyCart = new CustomEvent("emptyCartClick", {composed: true, bubbles: true})
            emptyCart.productData = shoppingCart; 
            console.log("emptied the shopping cart"); 

            this.dispatchEvent(emptyCart); 
        }); 

        return emptyCartBtn; 
    }

    //---------------------------------------------------------------
    deleteButton(product){
        const deleteProdBtn = document.createElement("button"); 
        deleteProdBtn.innerText = "Delete"; 

        deleteProdBtn.addEventListener(`click`, evt =>{
            const deleteProd = new CustomEvent("deleteProdClick", {composed: true, bubbles: true})
            deleteProd.productData = product;
            console.log("deleted product from cart"); 

            this.dispatchEvent(deleteProd); 
        }); 
        return deleteProdBtn; 
    }

    //--------------------------------------------------------------------
    incQuantityButton(product){
        const plusQuantityBtn = document.createElement("button"); 
        plusQuantityBtn.innerText = " + "; 

        plusQuantityBtn.addEventListener(`click`, evt => {
            const plusQuantity = new CustomEvent("plusQuantityClick", {composed:true, bubbles:true})
            plusQuantity.productData = product;  
            console.log("plus in quantity on product");

            this.dispatchEvent(plusQuantity);
        })

        return plusQuantityBtn; 
    }
    
    //------------------------------------------------------------------------
    decQuantityButton(product){
        
        const minQuantityBtn = document.createElement("button"); 
        minQuantityBtn.innerText = " - "; 

        minQuantityBtn.addEventListener(`click`, evt =>{
            const minQuantity = new CustomEvent("minusQuantityClick", {composed:true, bubbles:true})
            minQuantity.productData = product; 
            console.log("minus in cuantity on product"); 

            this.dispatchEvent(minQuantity); 
        })

        return minQuantityBtn; 
    }

    //--------------------------------------------------------------
    calculateTotalPrice(shoppingCart){
        let totalPrice = 0; 

        for (let value of shoppingCart){
        let product = value.product; 

        let priceProduct = this.priceForProduct(product); 
        let individualProduct = ""; 
        individualProduct = priceProduct * value.quantity; 

        totalPrice = individualProduct + totalPrice; 
        } 

        return totalPrice; 
    }
}
//==========================================================
export class CheckoutView extends HTMLElement{
    constructor(){
        super(); 
        this.shadow = this.attachShadow({mode: "open"});
    }

    refresh(data, cartTotal){
    if(!data) {return}
    this.shadow.innerHTML = ""; 
    
    const form = document.createElement("form"); 
    
    form.innerHTML = `
        <h1>CheckOut Page</h1>

            <label for="customerName">Full name: </label>
            <input type="text" id="customerName" required><br>

            <label for="customerEmail">Email: </label>
            <input type="email" id="customerEmail" required><br>

            <label for="customerPhone">Phone: </label>
            <input type="tel" id="customerPhone"><br>

            <label for="customerStreet">Street: </label>
            <input type="text" id="customerStreet" required><br>

            <label for="customerCity">City: </label>
            <input type="text" id="customerCity" required><br>

            <label for="customerZip">Zip Code: </label>
            <input type="number" id="customerZip" required><br>

            <label for="customerCountry">Country: </label>
            <input type="text" id="customerCountry" required><br>

            <label for="shippingTypes">Shipping type: </label>
            <select id="shippingTypes" required>
                <option value="">Choose shipping method </option>
            </select><br>

            <input type="submit" value="Place order">
            <h2 id="orderTotal"></h2>
            `;
        this.placeOrderButton(form);
        this.shadow.appendChild(form); 
    
        const shippingTypes = this.shadowRoot.querySelector("#shippingTypes"); 
        const orderTotal = this.shadow.querySelector("#orderTotal"); 

        for (let value of data){
            const option = document.createElement("option"); 

            option.value = value.id;
            option.innerText = `${value.type} - ${value.price} kr`;

            shippingTypes.appendChild(option)
       
        } 
        
        this.calculateTotalWithShipping(shippingTypes, cartTotal, data, orderTotal)
       
    } 

    //----------------------------------------------------------------------------- 
    placeOrderButton(form){
        form.addEventListener("submit", evt =>{
            evt.preventDefault();

            let shipping_id = this.shadow.querySelector("#shippingTypes").value; 
            let name = this.shadow.querySelector("#customerName").value; 
            let phone = this.shadow.querySelector("#customerPhone").value; 
            let email = this.shadow.querySelector("#customerEmail").value; 

            let street = this.shadow.querySelector("#customerStreet").value; 
            let city  = this.shadow.querySelector("#customerCity").value; 
            let zipCode = this.shadow.querySelector("#customerZip").value; 
            let country = this.shadow.querySelector("#customerCountry").value; 

            let content = JSON.parse(localStorage.getItem("productsInCart"));

            let order = {shipping_id :shipping_id, name: name, email:email, phone:phone , city:city, street:street, zipCode:zipCode, country:country, content: content}

            console.log("My order", order); 

            const placeOrder = new CustomEvent("placeOrderClick", {composed: true, bubbles: true});
            placeOrder.productData = order; 

            this.dispatchEvent(placeOrder);
            console.log("your order has been placed");
        });
    }  

    //-------------------------------------------------------------------------------
    calculateTotalWithShipping(shippingTypes, cartTotal, data, orderTotal){
        shippingTypes.addEventListener("change", evt => {

        let selectedIndex = shippingTypes.selectedIndex;
        let shippingPrice = data[selectedIndex - 1].price;

        let totalWithShipping = cartTotal + Number(shippingPrice); 
        orderTotal.textContent = `Total Price with shipping ${totalWithShipping}  kr`; 
        }); 
    }    
} 
//=====================================================
export class ConfirmationView extends HTMLElement{
    constructor(){
        super(); 
        this.shadow = this.attachShadow({mode: "open"});
    }

    refresh(data){
        if(!data) {return}
        this.shadow.innerHTML = ""; 

        this.shadowRoot.innerHTML = `
            <h1>Confirmation page</h1>
            <p> Name ${data.name}</p>
            <p> Email 
            <p> Phone
            <p> Product will be sent to follwing delivery adress
            `; 
    }
}

//================================================
customElements.define("cat-view", CategoryView); 
customElements.define("prod-view", ListView);
customElements.define("detail-view", DetailView);
customElements.define("cart-view", CartView); 
customElements.define("checkout-view", CheckoutView); 
customElements.define("confirmation-view", ConfirmationView); 