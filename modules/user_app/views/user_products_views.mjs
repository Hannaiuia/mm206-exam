import { showMessage } from "../../message_handler.mjs";
import { priceForProduct, calculateTotalPrice, formatStock} from "../../utils.mjs";

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
                const catEvt = new CustomEvent("categorySelectClick", {composed: true, bubbles:true }); 
                catEvt.categoryData = value; 
                this.shadow.dispatchEvent(catEvt); 
            }); 
        }
    }
}
//==============================================
export class ProdView extends HTMLElement{
    //------------------------------------------
    constructor(){
        super(); 
        this.shadow = this.attachShadow({mode: "open"});
    }

    refresh(data){
        if(!data) {return} //if an error is catched in api_services

        this.shadow.innerHTML = ""; 
        for(let value of data) {

            let imageKey = "GFTPOE21"; 
            if(!value.static) imageKey = "YNWWOG84"; 

            const div = document.createElement("div"); 

            div.innerHTML = `
                <h2>${value.name}</h2> 
                <img src = "https://sukkergris.onrender.com/images/${imageKey}/small/${value.thumb}">
                <p> ${value.shortDescr} </p>
                <p> ${value.price},- kr</p><hr>
            `;
            this.shadow.appendChild(div); 

            div.addEventListener(`click`, evt => {
                const productsEvt = new CustomEvent("productClick", {composed: true, bubbles:true }); 
                productsEvt.productData = value; 
                this.shadow.dispatchEvent(productsEvt); 
            }); 
        }
    }
}
//================================================
export class DetailView extends HTMLElement{
    //--------------------------------------
    constructor(){
        super(); 
        this.shadow = this.attachShadow({mode: "open"}); 
    }

    refresh(data, userInfo){
        if(!data) {return}
        this.shadow.innerHTML = ""; 

        let imageKey = "GFTPOE21"; 
        if(!data.static) imageKey = "YNWWOG84"; 
        
        this.shadow.innerHTML = `
            <link rel="stylesheet" href="modules/style.css"></link> 
            <h2>${data.name}</h2>
            <h3 id="sale"> ${this.formatSale(data)} </h3>
            <img src = "https://sukkergris.onrender.com/images/${imageKey}/large/${data.image}">
            <br>
            <h3> ${formatStock(data)} </h3>
            <p> Category: ${data.catName} </p>
            <p> ${data.descr} </p>
            <h3> ${this.formatPrice(data)}</h3>
            <p> ${this.formatRating(data)} </p>
            `; 

        const buyProdBtn = document.createElement("button"); 
        buyProdBtn.innerText = "Buy Product"; 
        this.shadow.appendChild(buyProdBtn); 

        buyProdBtn.addEventListener(`click`, evt =>{
            const buyProduct = new CustomEvent("buyProdClick", {composed: true, bubbles: true})
            buyProduct.productData = data;
            this.dispatchEvent(buyProduct); 
            console.log("added product"); 
        })

        if(userInfo !== null ){
            const reviewForm = document.createElement("form"); 
            reviewForm.innerHTML = `
                <hr>
                <h2>Give a review!</h2>
                <label for="customerRating"> Rate product: </label>
                <select id="customerRating">
                    <option value="">Choose a rating for the product</option>
                    <option value="1"> 1 star </option>
                    <option value="2"> 2 stars </option>
                    <option value="3"> 3 stars </option>
                    <option value="4"> 4 stars </option>
                    <option value="5"> 5 stars </option>
                 </select><br>

                <label for="customerComment"> Review: </label> <br>
                <textarea id="customerComment" rows = "10" cols = "42" ></textarea> <br>

                <input type="submit" value="Submit your review!">

            `; 
            this.shadow.appendChild(reviewForm); 
            this.submitReview(reviewForm, data); 
        
        }
    }

    //--------------////-------------------------------------
    formatPrice(data){
        if (data.sale > 0){
            return `<span class="oldPrice"> Original price:  ${data.price} ,-kr </span><br> New price: ${priceForProduct(data)} ,-kr`; 
        }else{
            return "Price: " + priceForProduct(data) +  ",-kr"; 
        }}

    //-----------------------------------------------------------
    formatSale(data){
        if (data.sale > 0){
            return "The product is on " + data.sale + " % sale "; 
        }else{
            return ""; 
        }
    }
    //------------------------------------------------------------
    formatRating(data){
        if(data.rating == null){
            return "Note! The item has not been rated yet! "; 
        }else{
            return `Rating: ${Number(data.rating).toFixed(1)}`; 
        }}
    //-----------------------------------------------------------------
    submitReview(reviewForm, data){
        reviewForm.addEventListener("submit", evt =>{
            evt.preventDefault();

            let rating= this.shadow.querySelector("#customerRating").value; 
            let comment = this.shadow.querySelector("#customerComment").value; 

            let reviewData = {product_id: data.id, rating: Number(rating), comment_text: comment}
        
            const review = new CustomEvent("submitReviewClick", {composed: true, bubbles: true});
            review.productData = reviewData; 

            this.dispatchEvent(review); 
            console.log("a review has been submitted")
            });
    }
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

        this.shadow.innerHTML = `
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
            <hr>
            <h2>${product.name}</h2>
            <p> Product number ${product.id} </p>
            <h3> Pris kr ${priceForProduct(product)}</h3>
            <p> Quantity: <span class="quantity"><span class="number"></span></span> </p>
            <p> Total price per product ${priceForProduct(product) * value.quantity} kr </p>
            <h3> ${formatStock(product,value.quantity)} </h3>
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
            Total price: ${calculateTotalPrice(data)}
            `; 
            this.shadow.appendChild(h2); 

        this.shadow.appendChild(emptyCartBtn); 
        this.shadow.appendChild(checkOutBtn); 
    
    } 

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
}
//==========================================================
export class CheckoutView extends HTMLElement{
    constructor(){
        super(); 
        this.shadow = this.attachShadow({mode: "open"});
    }

    refresh(data, cartTotal, userInfo){
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

            <h2 id="orderTotal"></h2>

            <input type="submit" value="Place order" ;>
            `;
        this.placeOrderButton(form);
        this.shadow.appendChild(form); 

        if(userInfo){
        const loginData = userInfo.logindata; 
            this.shadow.querySelector("#customerName").value = loginData.full_name; 
            this.shadow.querySelector("#customerEmail").value = loginData.username; 
            this.shadow.querySelector("#customerStreet").value = loginData.street; 
            this.shadow.querySelector("#customerCity").value = loginData.city; 
            this.shadow.querySelector("#customerZip").value = loginData.zipcode; 
            this.shadow.querySelector("#customerCountry").value = loginData.country; 
        }
    
        const shippingTypes = this.shadow.querySelector("#shippingTypes"); 
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

            let shippingId = this.shadow.querySelector("#shippingTypes").value; 
            let shippingMethod = this.shadow.querySelector("#shippingTypes").selectedOptions[0].text;
            let customerName = this.shadow.querySelector("#customerName").value; 
            let phone = this.shadow.querySelector("#customerPhone").value; 
            let email = this.shadow.querySelector("#customerEmail").value; 

            let street = this.shadow.querySelector("#customerStreet").value; 
            let city  = this.shadow.querySelector("#customerCity").value; 
            let zipcode = this.shadow.querySelector("#customerZip").value; 
            let country = this.shadow.querySelector("#customerCountry").value; 

            let content = JSON.parse(localStorage.getItem("productsInCart"));

            let order = {shippingId, customerName, email, phone , city, street, zipcode, country, content}

            console.log("My order", order); 

            const placeOrder = new CustomEvent("placeOrderClick", {composed: true, bubbles: true});
            placeOrder.productData = order; 
            placeOrder.shippingMethod = shippingMethod;
            placeOrder.totalWithShipping = this.shadow.querySelector("#orderTotal").totalWithShipping;

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
        orderTotal.totalWithShipping = totalWithShipping; 
        }); 
    }    
} 
//=====================================================
export class ConfirmationView extends HTMLElement{
    constructor(){
        super(); 
        this.shadow = this.attachShadow({mode: "open"});
    }

    refresh(order, response, shippingMethod, totalWithShipping){
        if(!order) {return}
        this.shadow.innerHTML = ""; 

        this.shadow.innerHTML = `
            <h1>Order confirmation</h1>
            <p> Thank you for ordering from us! Your order has now been sent!</p>
            <p> Your order number is ${response.record.id}</p>
            <p> Name ${order.customerName}</p>
            <p> Email ${order.email}</p>
            <p> Phone ${order.phone}</p>
            <p> Product will be sent to follwing delivery adress ${order.city} ${order.street} ${order.zipcode} ${order.country}</p>
            <br>
            `; 

        for(let product of order.content){
            let productData = product.product; 
            let productPrice = priceForProduct(productData);
            let unitPrice = productPrice * product.quantity;
            let delivery = new Date(productData.delivery).toLocaleDateString("nb-NO"); 
        
            const div = document.createElement("div"); 

            div.innerHTML = `
            <hr>
            <h2> Name: ${productData.name}</h2>
            <p> Product number: ${productData.id}</p>
            <p> Price per product  ${productPrice} kr </p>
            <p> Quantity of product ${product.quantity} </p>
            <p> Total price ${unitPrice} kr </p>
            <p> Product will be delivered ${delivery}</p>
            
            `; 

            this.shadow.appendChild(div);   
        }
        
        const shippingSummary = document.createElement("div"); 
        shippingSummary.innerHTML = `
            <hr>
            <h3> You selected:"${shippingMethod}" type of shipping </h3>
            <p> Your total with shipping is: ${totalWithShipping} kr </p>
            <p> Your product will be sent  ${this.calculateShippingDate(order)};  
            `; 
        this.shadow.appendChild(shippingSummary); 
    }
    //---------------------------------------------------------------------
       calculateShippingDate(order){
        let shippingDate = new Date(); 

        for (let value of order.content){
            if(value.quantity> value.product.stock){
                const date = new Date(value.product.delivery); 

                if(date > shippingDate){
                    shippingDate = date; 
                }
            }
        }
        return shippingDate.toLocaleDateString("nb-NO"); 
    }
}

//==========================================================================
export class CreateUserView extends HTMLElement{
    constructor(){
        super(); 
        this.shadow = this.attachShadow({mode: "open"});
    }

    refresh(){
        this.shadow.innerHTML = ""; 

        const form = document.createElement("form"); 
        form.innerHTML = `
            <h1>Create User</h1>

            <label for="customerName">Full name: </label>
            <input type="text" id="customerName" required><br>

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


            <label for="customerPicture">Picture: </label>
            <input type="file" id="customerPicture" accept="image/png, image/jpeg"> 
            <br></br>

            <label for="customerUserName">Username: </label>
            <input type="email" id="customerUserName" required><br>

            <label for="customerPassword"> Password: </label>
            <input type="password" id="customerPassword" required><br>

            <input type="submit" value="Create your user">
            
            `; 
            this.shadow.appendChild(form);
            this.createUserButton(form); 

    }

    //-------------------------------------------------------------------------
    createUserButton(form){
        form.addEventListener("submit", evt =>{
            evt.preventDefault();

            let fullname = this.shadow.querySelector("#customerName").value; 
            let phone = this.shadow.querySelector("#customerPhone").value; 

            let street = this.shadow.querySelector("#customerStreet").value; 
            let city  = this.shadow.querySelector("#customerCity").value; 
            let zipcode = this.shadow.querySelector("#customerZip").value; 
            let country = this.shadow.querySelector("#customerCountry").value; 

            let picture = this.shadow.querySelector("#customerPicture").files[0]; 
            let username = this.shadow.querySelector("#customerUserName").value; 
            let password = this.shadow.querySelector("#customerPassword").value; 

            if(!this.checkImage(picture)){return;}
            
            let newUser = {fullname, phone, city, street, zipcode, country,picture, username, password}; 

            console.log("A user has been added", newUser); 
        
            const makeUser = new CustomEvent("makeUserClick", {composed: true, bubbles: true});
            makeUser.productData = newUser; 

            console.log("Sending:", JSON.stringify(newUser));
            this.dispatchEvent(makeUser); 
            console.log("a user has been added?")
            });
    }
    //--------------------------------------------------------------------------------
    checkImage(picture){
        if(!picture){
            return true; 
        } else if(picture.type !=="image/png" && picture.type !== "image/jpeg" || picture.size > 1024 * 1024){
            showMessage("Please select a PNG or JPG, or a smaller image than 1MB")
            return false; 
        }else{
            return true; 
        }
    }
}

//===============================================================================
export class LoginView extends HTMLElement{
    constructor(){
        super(); 
        this.shadow = this.attachShadow({mode: "open"});

    }
    refresh(){
        this.shadow.innerHTML = ""; 
    
        
        const form = document.createElement("form"); 
    
        form.innerHTML = `
            <h1>Login</h1>

            <label for="customerUserName">Username: </label>
            <input type="email" id="customerUserName" required><br>

            <label for="customerPassword"> Password: </label>
            <input type="password" id="customerPassword" required><br>

            <input type="submit" value="Login here">
            
            `; 
            this.shadow.appendChild(form); 
            this.loginButton(form); 
    }
    //--------------------------------------------------------
    loginButton(form){
        form.addEventListener("submit", evt =>{
            evt.preventDefault();
            let username = this.shadow.querySelector("#customerUserName").value; 
            let password = this.shadow.querySelector("#customerPassword").value; 
        
            let user = {username, password}; 
        
            const loginUser = new CustomEvent("loginUserClick", {composed: true, bubbles: true});
            loginUser.productData = user; 

            this.dispatchEvent(loginUser); 
        })
    }
}


//================================================
customElements.define("cat-view", CategoryView); 
customElements.define("prod-view", ProdView);
customElements.define("detail-view", DetailView);
customElements.define("cart-view", CartView); 
customElements.define("checkout-view", CheckoutView); 
customElements.define("confirmation-view", ConfirmationView); 
customElements.define("create-user-view", CreateUserView); 
customElements.define("login-view", LoginView); 