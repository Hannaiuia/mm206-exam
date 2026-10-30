//this is the service layer module that handles the communication with the server hihi

//import
import { errorHandler} from "./error_handler.mjs"; 
import { CategoryArrayModel, ProductArrayModel } from "./models.mjs";
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
        
        console.log("Raw product data:", dataFromServer);

        // convert from server-data to app model - data
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