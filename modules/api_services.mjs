//this is the service layer module that handles the communication with the server hihi

//import
import { errorHandler} from "./error_handler.mjs"; 
import { CategoryArrayModel, ProductArrayModel, ShippingMethodsArrayModel, OrderModel} from "./models.mjs";
import { sendRequest, createBasicAuthString} from "./utils.mjs";

const groupkey = "YNWWOG84"; 

//-----------------------------------------------
export async function getCategories(){
    const url = `https://sukkergris.onrender.com/webshop/categories?key=${groupkey}`; 

    try {
        const dataFromServer = await sendRequest(url); 

        console.log("Raw category data:", dataFromServer);

        //convert from server-data to app model-data
        const model = new CategoryArrayModel(dataFromServer); 
        console.log("Converted categories:", model.data);
        return model.data; 

    } catch (error){
        errorHandler(error); 
        return []; 
    }
}

//-------------------------------------------------
export async function getAllProducts() {
    
    const url = `https://sukkergris.onrender.com/webshop/chocolates?key=${groupkey}`; 

    try {
        const dataFromServer = await sendRequest(url);

        //convert from server-data to app model-data
        const model = new ProductArrayModel(dataFromServer); 
        return model.data; 

       } catch (error){
        errorHandler(error); 
        return []; 
    }
}

//------------------------------------------------
export async function getProductsByCategory(catId) {
    const url = `https://sukkergris.onrender.com/webshop/chocolates?catID=${catId}&key=${groupkey}`;
    
    try {

        const dataFromServer = await sendRequest(url); 
        
        //console.log("Raw product data:", dataFromServer);

        // convert from server-data to app model - data
        const model = new ProductArrayModel(dataFromServer); 
        return model.data; 

    } catch(error) {
        errorHandler(error); 
        return []; 
    }
}

//-------------------------------------------------
export async function getIndividualProduct(id){
    const url = `https://sukkergris.onrender.com/webshop/chocolates?id=${id}&key=${groupkey}`

    try {
        const dataFromServer = await sendRequest(url);

        // convert from server.data to app model-data
        const model = new ProductArrayModel(dataFromServer); 
        return model.data; 

    } catch(error) {
        errorHandler(error); 
        return []; 
    }
}

//-------------------------------------------------
export async function searchProducts(search){
    const url = `https://sukkergris.onrender.com/webshop/chocolates?search=${search}&key=${groupkey}`; 

    try {
        const dataFromServer = await sendRequest(url); 

        //convert from server-data to app model data
        const model = new ProductArrayModel(dataFromServer); 
        return model.data; 
    
    } catch(error){
        errorHandler(error); 
        return []; 
    }
}

//-----------------------------------------------------
export async function getShippingMethods(){
    const url = `https://sukkergris.onrender.com/logistics/shippingtypes?key=${groupkey}`; 

    try {
        const dataFromServer = await sendRequest(url); 

        //convert from server-data to app model data
        const model = new ShippingMethodsArrayModel(dataFromServer); 
        return model.data; 
    
    } catch(error){
        errorHandler(error); 
        return []; 
    }
}

//-----------------------------------------------------
export async function sendOrder(order){
    const url = `https://sukkergris.onrender.com/webshop/orders?key=${groupkey}`;

    const model = new OrderModel(order)

    const cfg = {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(model.data)
    };

    try {
        const data = await sendRequest(url,cfg); 
        return data; 

    } catch (error) {
        errorHandler(error);
        return null; 
    }
}
//----------------------------------------------------
export async function createUser(newUser){
    const url = `https://sukkergris.onrender.com/users?key=${groupkey}`; 

    const formData = new FormData();

    for(let label in newUser){
        if(newUser[label] !== undefined && newUser[label] !== ""){
            formData.append(label, newUser[label]);
        }
    }

    const cfg = {
        method: "POST",
        body: formData
    }

    try {
        const data = await sendRequest(url, cfg);
        return data;

    } catch (error) {
        errorHandler(error);
        return null; 
    }
}

//-------------------------------------------------------
export async function loginUser(user){
    const url = `https://sukkergris.onrender.com/users/login?key=${groupkey}`; 

    const authentication = createBasicAuthString(user.username, user.password)

    const cfg ={
        method: "POST", 
        headers: {
            "authorization": authentication
        },
    }

    try {
        const data = await sendRequest(url, cfg);
        return data;

    } catch (error) {
        errorHandler(error);
        return null; 
    }
}
//------------------------------------------------------------
export async function addComment(reviewData){
    const url = `https://sukkergris.onrender.com/webshop/comments?key=${groupkey}`; 

    const stored = JSON.parse(sessionStorage.getItem("userLogin"));
    if(!stored){
        return null;
    }
    const token = stored.logindata.token;

    const cfg ={
        method: "POST", 
        headers: {
            "authorization": token,
            "content-type": "application/json"
        },
        body: JSON.stringify(reviewData)
    }; 

    try {
        const data = await sendRequest(url, cfg);
        return data;

    } catch (error) {
        errorHandler(error);
        return null; 
    }

}

//--------------------------------------------------
export async function adminLogin(Authorization) {
    const url = `https://sukkergris.onrender.com/users/adminlogin?key=${groupkey}`;
    const header = {Authorization};

    try{
        const dataForAdmin = await sendRequest(url, {
            method: "POST",
            headers: header
        });
        console.log(dataForAdmin)
        return dataForAdmin;

    } catch(error){
        errorHandler(error);
    }
    
}

//--------------------------------------------------
export async function adminAddProd(Authorization, theForm) {
    const url = `https://sukkergris.onrender.com/webshop/chocolates?key=${groupkey}`;
    const header = {Authorization};
    
    try{
        const dataAddProd = await sendRequest(url, {
            method: "POST",
            headers: header,
            body: theForm
        },);
        return dataAddProd;

    } catch(error){
        errorHandler(error);
    }
}

//----------------------------------------------------
export async function adminChangeProd(Authorization, theForm) {
    const url = `https://sukkergris.onrender.com/webshop/chocolates?key=${groupkey}`;
    const header = {Authorization};

    try{
        const changeData = await sendRequest(url, {
            method: "PUT",
            headers: header,
            body: theForm
        });
        return changeData;

    } catch(error){
        errorHandler(error)
    }
    
}

//-----------------------------------------------------
export async function adminDeleteProd(Authorization, productID) {
    const url = `https://sukkergris.onrender.com/webshop/chocolates?key=${groupkey}&id=${productID}`
    const header = {Authorization};


    try{
        const deleteData = await sendRequest(url, {
            method: "DELETE",
            headers: header,
        });
        return deleteData;

    } catch(error){
        errorHandler(error);
    }
    
}

//-------------------------------------------------------
export async function adminOrderList(Authorization) {
    const url = `https://sukkergris.onrender.com/webshop/orders?key=${groupkey}`;
    const header = {Authorization};

    try{
        const getOrders = await sendRequest(url, {
            method: "GET",
            headers: header,
        });
        return getOrders;
    } catch(error){
        errorHandler(error);
    }
    
}

//---------------------------------------------------------
export async function adminOrderDelete(Authorization, orderId) {
    const url = `https://sukkergris.onrender.com/webshop/orders?key=${groupkey}&id=${orderId}`;
    const header = {Authorization};

    try{
        const deleteOrder = await sendRequest(url, {
            method: "DELETE",
            headers: header,
        });
        return deleteOrder;

    } catch(error){
        errorHandler(error);
    }
    
}
