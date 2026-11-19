import {getCategories, getAllProducts, getProductsByCategory,searchProducts, adminLogin } from "../api_services.mjs";
import {CategoryView, ProductForm, ProductView } from "./views/admin_product_views.mjs";
import {adminLoginView } from "./views/admin_login_view.mjs";
import {adminMenuView } from "./views/admin_menu_view.mjs";
import { errorHandler } from "../error_handler.mjs";

//------------------------------------------------

const viewContainer = document.getElementById("viewContainer"); 
const catView = new CategoryView();
const prodView = new ProductView();
const prodForm = new ProductForm();
const MenuView = new adminMenuView();
const loginView = new adminLoginView();
//const error = new errorHandler();

loginView.refresh();

//------------------------------------------------

const viewMap = {
    "catview": catView,
    "prodview": prodView,
    "prodform": prodForm,
    "adminLogin": loginView,
    "Menuview": MenuView
    
}

//------------------------------------------------

function navigateTo(viewName, push){
    //push se excerise 3
    if(push){
        history.pushState(viewName, "", "#" + viewName);
    }

    viewContainer.innerHTML = ""; 
    viewContainer.appendChild(viewMap[viewName]); 

}

//------------------------------------------------

function createBasicAuthString(username, password) {
let combinedStr = username + ":" + password;
let b64Str = btoa(combinedStr);
return "basic " + b64Str; //return the basic authentication string
}

//------------------------------------------------

MenuView.addEventListener("adminProdView", async function(evt) {
    console.log("catview");
    const categories = await getCategories();
    catView.refresh(categories)
    navigateTo("catview", true);
})

//------------------------------------------------

catView.addEventListener('categoryselect', async function(evt) {
    const categoryId = evt.categoryData.id;
    const products = await getProductsByCategory(categoryId);
    console.log("cat product view")
    prodView.refresh(products);
})

//------------------------------------------------

let token = "";

//------------------------------------------------
loginView.addEventListener("prodAdminView", async (evt) => {
    console.log("login button click")

    let loginAttemt = createBasicAuthString(evt.detail.username, evt.detail.password)
    const dataForAdmin = await adminLogin(loginAttemt)

    if(dataForAdmin.msg === "administrator login OK"){
        console.log("Succses login")

        token = dataForAdmin.logindata.token;
        navigateTo("Menuview")
    }else{
        loginView.errorMessage();
    }
})

//------------------------------------------------

window.addEventListener("popstate", function(evt){
    if(evt.state){
        navigateTo(evt.state);
    }
})

//------------------------------------------------

navigateTo("adminLogin")

//======================================================================================

/*import { getCategories, getAllProducts, getProductsByCategory } from "../api_services.mjs";
import { CategoryView, ProductForm, ProductView } from "./views/admin_product_views.mjs";
import { showMessage } from "../message_handler.mjs";

//init -------------------------------------------
const catView = new CategoryView();
const prodView = new ProductView();
const prodForm = new ProductForm();

const viewMap = {
    "catview": catView,
    "prodview": prodView,
    "prodform": prodForm
}
const viewContainer = document.getElementById("viewContainer");
const btnLogin = document.getElementById("btnLogin")
let passwordName = document.getElementById("passwordName");
let passwordInput = document.getElementById("passwordInput");

let adminName = passwordName.value;
let adminPassword = passwordInput.value;

//const btnAddProd = document.getElementById('btnAddProd');
//const btnHome = document.getElementById('btnHome');

//show categories at startup
const categories = await getCategories();
catView.refresh(categories);
//navigateTo("catview");

//------------------------------------------------
function navigateTo(viewName) {
    viewContainer.innerHTML = "";
    viewContainer.appendChild(viewMap[viewName]);
}

//------------------------------------------------
/*btnHome.addEventListener('click', function(evt) {
   navigateTo("catview"); 
});

//------------------------------------------------
/*btnAddProd.addEventListener('click', function(evt) {
    navigateTo("prodform");
});

//------------------------------------------------

btnLogin.addEventListener("click", function(evt){
    console.log(adminPassword)
    console.log(adminName)
    navigateTo("catview");
    

})

//------------------------------------------------
catView.addEventListener('categoryselect', async function(evt) {
    const categoryId = evt.categoryData.id;
    const products = await getProductsByCategory(categoryId);
    prodView.refresh(products);
    navigateTo("prodview");
});

//------------------------------------------------
prodForm.addEventListener('addproduct', async function(evt) {
    const result = await addProduct(evt.productForm);
    if (result) {
        showMessage("Insert OK!")
    };
});

*/






