import {getCategories, getAllProducts, getProductsByCategory,searchProducts } from "../api_services.mjs"
//import { CategoryArrayModel } from "../models.mjs";
import { CategoryView, ListView } from "./views/user_products_views.mjs";

const catView = new CategoryView(); 
const prodView = new ListView(); 
//detail-view

const viewMap = {
    "cat-view": catView, 
    "prod-view": prodView
}

const viewContainer = document.getElementById("viewContainer"); 
const btnHome = document.getElementById(`btnHome`); 
const btnSearch = document.getElementById(`btnSearch`); 
let myInput = document.getElementById("myInput"); 
let wrongSearch= document.getElementById("wrongSearch"); 

//show categories at startup 
const categories = await getCategories(); 
catView.refresh(categories); 
navigateTo("cat-view"); 

//---------------------------------------------
function navigateTo(viewName){
    //push se excerise 3
    viewContainer.innerHTML = ""; 
    viewContainer.appendChild(viewMap[viewName]); 
}

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
    } else{
        //prodView.refresh(products);     
    }
    //myInput.value = (""); 
}); 
//------------------------------------------------
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
    navigateTo("prod-view"); 
}); 
//----------------------------------------------
//window.addEventListener('popstate', function(evt) {
   // navigateTo(evt.state);
//});
//-----------------------------------------------