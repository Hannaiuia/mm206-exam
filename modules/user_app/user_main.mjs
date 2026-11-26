import {getCategories, getProductsByCategory,searchProducts, getIndividualProduct,getShippingMethods, sendOrder,createUser, loginUser, addComment } from "../api_services.mjs"
//import { CategoryArrayModel } from "../models.mjs";
import { showMessage } from "../message_handler.mjs";
import { calculateTotalPrice } from "../utils.mjs";
import { CategoryView, ProdView, DetailView, CartView, CheckoutView, ConfirmationView, CreateUserView, LoginView} from "./views/user_products_views.mjs";

//import data
const catView = new CategoryView(); 
const prodView = new ProdView(); 
const detailView = new DetailView(); 
const cartView = new CartView(); 
const checkoutView = new CheckoutView(); 
const confirmationView = new ConfirmationView(); 
const createUserView = new CreateUserView();
const loginView = new LoginView();  

const viewMap = {
    "cat-view": catView, 
    "prod-view": prodView,
    "detail-view": detailView, 
    "cart-view": cartView,
    "checkout-view": checkoutView, 
    "confirmation-view":confirmationView, 
    "create-user-view":createUserView, 
    "login-view": loginView
}

const viewContainer = document.getElementById("viewContainer"); 
const btnHome = document.getElementById(`btnHome`); 
const btnSearch = document.getElementById(`btnSearch`); 
const btnCart = document.getElementById(`btnCart`); 
const btnCreateUser = document.getElementById(`btnCreateUser`); 
const btnLogin = document.getElementById(`btnLogin`); 
const loginPicture = document.getElementById(`loginPicture`); 

let myInput = document.getElementById("myInput"); 
let wrongSearch = document.getElementById("wrongSearch"); 

//show categories at startup 
sessionStorage.removeItem("userLogin"); //removes info from checkoutView if there has been a login before 
const categories = await getCategories(); 
catView.refresh(categories); 

navigateTo("cat-view"); 
history.replaceState("cat-view", "", "#cat-view");

//---------------------------------------------
function navigateTo(viewName, push){
    if(push){
        history.pushState(viewName, "", "#" + viewName); //saves the navigation in the browser
    }
    wrongSearch.innerHTML="";  
    viewContainer.innerHTML = ""; 
    viewContainer.appendChild(viewMap[viewName]); 
}; 

//----------------------------------------------
btnSearch.addEventListener(`click`, async function(evt){ 
    let searchInput = myInput.value; 
    let finalInput = searchInput.toLowerCase(); 
    const products = await searchProducts(finalInput); 

    prodView.refresh(products);  //problem todo!!
    navigateTo("prod-view", true);

    myInput.value = "";

    if(products.length == 0){
        wrongSearch.innerHTML = "Your search did not match any products"; 
    }
}); 

//------------------------------------------------------
btnCart.addEventListener(`click`, function(evt){
    let cart = JSON.parse(localStorage.getItem("productsInCart")) || [];
    cartView.refresh(cart); 
    navigateTo("cart-view", true); 
})

//------------------------------------------------------
btnHome.addEventListener(`click`, function(evt){
    wrongSearch.innerHTML = (""); 
    myInput.value = (""); 
    navigateTo("cat-view",true); 
}); 

//------------------------------------------------------
btnCreateUser.addEventListener(`click`, function(evt){
    createUserView.refresh(); 
    navigateTo("create-user-view"); 
})

//------------------------------------------------------
btnLogin.addEventListener(`click`, function(evt){
    loginView.refresh(); 
    navigateTo("login-view"); 
})

//----------------------------------------------
catView.addEventListener(`categorySelectClick`, async function(evt){
    const categoryId = evt.categoryData.id; 
    const products = await getProductsByCategory(categoryId); 
    prodView.refresh(products); 
    navigateTo("prod-view", true); 
}); 

//----------------------------------------------
prodView.addEventListener(`productClick`, async function(evt){
    const productsId = evt.productData.id; 
    const product = await getIndividualProduct(productsId); 

    let userInfo = JSON.parse(sessionStorage.getItem("userLogin")) || null; 
    detailView.refresh(product[0], userInfo); 
    navigateTo("detail-view", true); 
});

//-----------------------------------------------------
detailView.addEventListener(`buyProdClick`, function(evt){
    const productData = evt.productData; 
    let cart = JSON.parse(localStorage.getItem("productsInCart")) || []; 

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

//-------------------------------------------------------------
detailView.addEventListener(`submitReviewClick`, async function(evt){
    const newReview = evt.productData; 
    const response = await addComment(newReview)

   /* if(!response){
        showMessage("YOUR REVIEW COULD NOT BE SAVED ")
        return; 
    }*/

    const product = await getIndividualProduct(newReview.product_id); 
    let userInfo = JSON.parse(sessionStorage.getItem("userLogin")); 
    detailView.refresh(product[0], userInfo); 
}); 

//------------------------------------------------------------
cartView.addEventListener(`checkoutClick`, async function(evt){
    let cart =  JSON.parse(localStorage.getItem("productsInCart")) || []; 
    
    if (cart.length === 0){
        showMessage("A product has to be added for checkout"); 
    }else{
        const shippingMethod =  await getShippingMethods();
        const cartTotal = calculateTotalPrice(cart); 

        let userInfo = JSON.parse(sessionStorage.getItem("userLogin")) || null; 
        checkoutView.refresh(shippingMethod, cartTotal, userInfo); 
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
});

//---------------------------------------------------------
cartView.addEventListener(`emptyCartClick`, function(evt){
    localStorage.removeItem(`productsInCart`); 
    cartView.refresh([]); 
}); 

//---------------------------------------------------------
cartView.addEventListener(`minusQuantityClick`, function(evt){
    const productData = evt.productData; 
    let cart = JSON.parse(localStorage.getItem("productsInCart")) || []; 

    const minQuantity = cart.find(item => item.product.id === productData.id); 

    if(minQuantity.quantity >1){
        minQuantity.quantity = minQuantity.quantity - 1; 
    }

    localStorage.setItem(`productsInCart`, JSON.stringify(cart)); 
    cartView.refresh(cart); 
});

//---------------------------------------------------------
cartView.addEventListener(`plusQuantityClick`, function(evt){
    const productData = evt.productData; 
    let cart = JSON.parse(localStorage.getItem("productsInCart")) || []; 

    const plusQuantity = cart.find(item => item.product.id === productData.id); 

    plusQuantity.quantity = plusQuantity.quantity + 1; 

    localStorage.setItem(`productsInCart`, JSON.stringify(cart)); 
    cartView.refresh(cart); 
});

//-----------------------------------------------------------
checkoutView.addEventListener("placeOrderClick", async function(evt){
    const order = evt.productData;
    const shippingMethod = evt.shippingMethod; 
    const totalWithShipping = evt.totalWithShipping;
    const response = await sendOrder(order);

    if(!response){return}; 
   // console.log(response); 

    localStorage.removeItem("productsInCart"); 
    confirmationView.refresh(order, response, shippingMethod, totalWithShipping);  
    navigateTo("confirmation-view", true)
}); 

//-----------------------------------------------------------------
createUserView.addEventListener("makeUserClick", async function (evt){
    //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",evt.productData)
    const newUser = evt.productData; 
    
    const response = await createUser(newUser); 

    loginView.refresh(newUser, response); 
    navigateTo("login-view", true)
}); 

//----------------------------------------------------------------------
loginView.addEventListener("loginUserClick", async function (evt){
    const user = evt.productData; 
    const response = await loginUser(user); 
    console.log("LOGIN RESPONSE:", response)

    if(!response){
        showMessage("Login failed! Check your username and password"); 
        return; 
    }

    sessionStorage.setItem("userLogin", JSON.stringify(response)); 

    loginPicture.src = `https://sukkergris.onrender.com/images/YNWWOG84/users/${response.logindata.thumb}`

    navigateTo("cat-view", true); 
}); 

//--------------------------------------------------
window.addEventListener('popstate', function(evt) {
    navigateTo(evt.state);
});
