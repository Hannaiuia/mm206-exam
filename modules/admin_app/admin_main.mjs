import {getAllProducts, adminLogin, adminAddProd, adminChangeProd, adminDeleteProd, adminOrderList, adminOrderDelete } from "../api_services.mjs";
import {ProductForm, ProductView } from "./views/admin_product_views.mjs";
import {AdminLoginView } from "./views/admin_login_view.mjs";
import {AdminMenuView } from "./views/admin_menu_view.mjs";
import {AdminOrdersView } from "./views/admin_orders_view.mjs";
import {errorHandler } from "../error_handler.mjs";

//------------------------------------------------

const viewContainer = document.getElementById("viewContainer"); 
const prodView = new ProductView();
const prodForm = new ProductForm();
const menuView = new AdminMenuView();
const loginView = new AdminLoginView();
const orderView = new AdminOrdersView();
let token = "";

loginView.refresh();

//------------------------------------------------

const viewMap = {
    "prodview": prodView,
    "prodform": prodForm,
    "adminLogin": loginView,
    "menuview": menuView,
    "orderview": orderView
    
}

//------------------------------------------------

function navigateTo(viewName, push){
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
return "basic " + b64Str; 
}

//------------------------------------------------

menuView.addEventListener("adminProdView", async function(evt) {
    const products = await getAllProducts();
    prodView.refresh(products)
    navigateTo("prodview", true);
})

//------------------------------------------------

menuView.addEventListener('adminOrderView', async function(evt) {
    const orders = await adminOrderList(token);
    orderView.refresh(orders);
    console.log(orders)
    navigateTo("orderview", true)
    
})

//------------------------------------------------

loginView.addEventListener("prodAdminView", async (evt) => {
    console.log("login button click")

    let loginAttemt = createBasicAuthString(evt.detail.username, evt.detail.password)
    const dataForAdmin = await adminLogin(loginAttemt)

    if(dataForAdmin.msg === "administrator login OK"){
        console.log("Succses login")

        token = dataForAdmin.logindata.token;
        navigateTo("menuview", true)
    }else{
        loginView.errorMessage();
    }
})

//------------------------------------------------

prodView.addEventListener('btnAddProduct', async function(evt) {
    navigateTo("prodform", true);
    prodForm.resetForm();
})

//------------------------------------------------

prodView.addEventListener('changeBtnClick', async function(evt) {
    let productDetail = await getAllProducts();

    let findProductId = productDetail.find(product => {
        return product.id === evt.detail;
    });

    navigateTo("prodform", true)
    prodForm.refresh(findProductId);
    console.log(findProductId);
});

//------------------------------------------------

prodView.addEventListener('backToMenuBtn', async function(evt) {
    navigateTo("menuview", true)
})

//------------------------------------------------

prodView.addEventListener('deleteBtnClick', async function(evt) {
    console.log("delete event")
    let productDetail = await getAllProducts();

    let findProductId = productDetail.find(product => {
        return product.id === evt.detail;
    });

    if(findProductId){
        await adminDeleteProd(token,evt.detail)
        let productList = await getAllProducts();
        prodView.refresh(productList);
    }

})

//------------------------------------------------

prodForm.addEventListener('addproduct', async function(evt) {
    console.log("submit button")
    if(await adminAddProd(token,evt.productForm)){
        console.log("product succses")
        prodForm.resetForm()
    } else {
        errorHandler("Product was not added")
    }

})

//------------------------------------------------

prodForm.addEventListener('changeProduct', async function(evt) {
    console.log("change")
    if(await adminChangeProd(token,evt.productForm)){
        console.log("change maybe")
        const products = await getAllProducts();
        prodView.refresh(products);
    }
    
})

//------------------------------------------------

prodForm.addEventListener('productView', async function(evt) {
    const products = await getAllProducts();
    prodView.refresh(products);
    navigateTo("prodview", true)
})

//------------------------------------------------

prodForm.addEventListener('menuView', async function(evt) {
    menuView.refresh();
    navigateTo("menuview", true)
})

//------------------------------------------------

prodForm.addEventListener('deleteBtnForm', async function(evt) {

    let productDetail = await getAllProducts();
    let findProductId = productDetail.find(product => {
        return product.id === evt.detail;
    });

    //--------------------------------------------

    if (!findProductId) {
        errorHandler("Product was not found");
        return;
    }

    //--------------------------------------------

    let deleteProduct = await adminDeleteProd(token, evt.detail);

    //--------------------------------------------

    if (!deleteProduct) {
        errorHandler("Product was not deleted");
        return;
    }

    //--------------------------------------------

    let productList = await getAllProducts();
    prodView.refresh(productList);
    navigateTo("prodview", true);
});

//------------------------------------------------

orderView.addEventListener('backToMenuBtn', async function(evt) {
    navigateTo("menuview", true);
})

//------------------------------------------------

orderView.addEventListener('deleteOrder', async function(evt) {
    let orderDetail = await adminOrderList(token);

    let findOrderId = orderDetail.find(order => {
        return order.id === evt.detail;
    })

    if(findOrderId){
        await adminOrderDelete(token, evt.detail);
        let orderlist = await adminOrderList(token);
        orderView.refresh(orderlist);
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
