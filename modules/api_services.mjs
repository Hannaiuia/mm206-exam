//this is the service layer module that handles the communication with the server hihi

//import
import { errorHandler} from "./error_handler.mjs"; 
import { CategoryArrayModel, ProductArrayModel, ShippingMethodsArrayModel} from "./models.mjs";
import { sendRequest } from "./utils.mjs";

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
        console.log("Data from server:", dataFromServer); 

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

    const orderData = {
        customer_name: order.name,
        street: order.street,
        city: order.city,
        zipcode: order.zipCode,
        country: order.country,
        email: order.email,
        phone: order.phone,
        shipping_id: order.shipping_id,
        content: JSON.stringify(order.content)
    };

    const cfg = {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(orderData)
    };

    try {
        const data = await sendRequest(url, cfg);
        return data;

    } catch (error) {
        errorHandler(error);
        return null; 
    }
}

