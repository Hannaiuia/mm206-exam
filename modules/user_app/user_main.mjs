import {getCategories, getAllProducts, getProductsByCategory,searchProducts, getIndividualProduct } from "../api_services.mjs"
//import { CategoryArrayModel } from "../models.mjs";
import { CategoryView, ListView, DetailView  } from "./views/user_products_views.mjs";

//import data
const catView = new CategoryView(); 
const prodView = new ListView(); 
const detailView = new DetailView(); 

const viewMap = {
    "cat-view": catView, 
    "prod-view": prodView,
    "detail-view": detailView
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
    console.log("entering shopping cart page"); 
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
