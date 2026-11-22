import {getCategories, getAllProducts, getProductsByCategory,searchProducts, getIndividualProduct,getShippingMethods, sendOrder } from "../api_services.mjs"
//import { CategoryArrayModel } from "../models.mjs";
import { CategoryView, ListView, DetailView, CartView, CheckoutView, ConfirmationView } from "./views/user_products_views.mjs";

//import data
const catView = new CategoryView(); 
const prodView = new ListView(); 
const detailView = new DetailView(); 
const cartView = new CartView(); 
const checkoutView = new CheckoutView(); 
const confirmationView = new ConfirmationView(); 

const viewMap = {
    "cat-view": catView, 
    "prod-view": prodView,
    "detail-view": detailView, 
    "cart-view": cartView,
    "checkout-view": checkoutView, 
    "confirmation-view":confirmationView
}

const viewContainer = document.getElementById("viewContainer"); 
const btnHome = document.getElementById(`btnHome`); 
const btnSearch = document.getElementById(`btnSearch`); 
const btnCart = document.getElementById(`btnCart`); 

let myInput = document.getElementById("myInput"); 
let wrongSearch = document.getElementById("wrongSearch"); 

//show categories at startup 
const categories = await getCategories(); 
catView.refresh(categories); 

navigateTo("cat-view"); 
history.replaceState("cat-view", "", "#cat-view");

//---------------------------------------------
function navigateTo(viewName, push){
    if(push){
        history.pushState(viewName, "", "#" + viewName); //saves the navigation in the browser
    }

    viewContainer.innerHTML = ""; 
    viewContainer.appendChild(viewMap[viewName]); 
}; 

//----------------------------------------------
btnSearch.addEventListener(`click`, async function(evt){ 
    let searchInput = myInput.value; 
    let finalInput = searchInput.toLowerCase(); 
    const products = await searchProducts(finalInput); 
    prodView.refresh(products); 
    navigateTo("prod-view");
    wrongSearch.innerHTML = (""); 

    if(products.length == 0){
        wrongSearch.innerHTML = "Your search did not match any products"; 
    }
}); 

//------------------------------------------------------

btnCart.addEventListener(`click`, function(evt){
    let cart = JSON.parse(localStorage.getItem("productsInCart")) || [];
    cartView.refresh(cart); 
    navigateTo("cart-view", true); 
   // console.log("entering shopping cart page"); 
})
//------------------------------------------------------
btnHome.addEventListener(`click`, function(evt){
    wrongSearch.innerHTML = (""); 
    myInput.value = (""); 
    navigateTo("cat-view"); 
}); 

//----------------------------------------------
catView.addEventListener(`categoryselect`, async function(evt){
    const categoryId = evt.categoryData.id; 
    const products = await getProductsByCategory(categoryId); 
    prodView.refresh(products); 
    navigateTo("prod-view", true); 
}); 

//----------------------------------------------
prodView.addEventListener(`productclick`, async function(evt){
    const productsId = evt.productData.id; 
    const product = await getIndividualProduct(productsId); 
    detailView.refresh(product[0]); 
    navigateTo("detail-view", true); 
});

//-----------------------------------------------------

detailView.addEventListener(`buyProdClick`, function(evt){
    //console.log("Product received:", evt.productData);
    const productData = evt.productData; 
    let cart = JSON.parse(localStorage.getItem("productsInCart")) || []; 

    //console.log("Cart before adding:", cart);

    const excistingItem = cart.find(item => item.product.id === productData.id); 

    if(excistingItem){
        excistingItem.quantity++; 
    }else{
        cart.push({
            product: productData, 
            quantity: 1
        })
    }

    localStorage.setItem("productsInCart", JSON.stringify(cart)); 
    
    console.log(localStorage.getItem("productsInCart")); 
}); 

//------------------------------------------------------------
cartView.addEventListener(`checkoutClick`, async function(evt){
    let cart =  JSON.parse(localStorage.getItem("productsInCart")) || []; 
    
    if (cart.length === 0){
        console.log("A product has to be added for checkout"); 
    }else{
        const shippingMethods =  await getShippingMethods();
        const cartTotal = cartView.calculateTotalPrice(cart); 

        checkoutView.refresh(shippingMethods, cartTotal); 
        navigateTo("checkout-view", true); 
    }
}); 

//--------------------------------------------------------------
cartView.addEventListener(`deleteProdClick`, function(evt){
    const productData = evt.productData; 
    let cart = JSON.parse(localStorage.getItem("productsInCart")) || []; 

    const deleteProd = cart.filter(item => item.product.id !== productData.id); 

    localStorage.setItem(`productsInCart`, JSON.stringify(deleteProd)); 
    cartView.refresh(deleteProd); 
})

//---------------------------------------------------------
cartView.addEventListener(`emptyCartClick`, function(evt){
    localStorage.removeItem(`productsInCart`); 
    cartView.refresh([]); 
})

//---------------------------------------------------------
cartView.addEventListener(`minusQuantityClick`, function(evt){
    //console.log("Minus event received!");
    const productData = evt.productData; 
    let cart = JSON.parse(localStorage.getItem("productsInCart")) || []; 

    const minQuantity = cart.find(item => item.product.id === productData.id); 

    if(minQuantity.quantity >1){
        minQuantity.quantity = minQuantity.quantity - 1; 
    }

    localStorage.setItem(`productsInCart`, JSON.stringify(cart)); 
    cartView.refresh(cart); 
})

//---------------------------------------------------------
cartView.addEventListener(`plusQuantityClick`, function(evt){
    const productData = evt.productData; 
    let cart = JSON.parse(localStorage.getItem("productsInCart")) || []; 

    const plusQuantity = cart.find(item => item.product.id === productData.id); 

    plusQuantity.quantity = plusQuantity.quantity + 1; 

    localStorage.setItem(`productsInCart`, JSON.stringify(cart)); 
    cartView.refresh(cart); 
})

//-----------------------------------------------------------
checkoutView.addEventListener("placeOrderClick", async function(evt){
    const order = evt.productData; 
    const response = await sendOrder(order); 

    console.log(response); 
    confirmationView.refresh(response, order);  
    navigateTo("confirmation-view", true)
}); 

//------------------------------------------
prodView.addEventListener(`backclick`, function(){
    history.back()
}); 

//--------------------------------------------------
detailView.addEventListener(`backclick`, function(){
    history.back()
}); 

//--------------------------------------------------
window.addEventListener('popstate', function(evt) {
    navigateTo(evt.state);
});
