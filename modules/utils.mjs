//this module contains general “helper” functions that can be used throughout the application

//-------fetch wrapper function -----------------

export async function sendRequest(url, cfg){
    cfg = cfg || {}; //if no cfg, create one
    cfg.signal = AbortSignal.timeout(5000); 

    try {

        const response = await fetch(url,cfg); 
        const data = await response.json(); 

        if (!response.ok){
            throw new Error(data.msg); 
        }
        return Promise.resolve(data); //forward resolved promise 

    } catch (error){
        return Promise.reject(error); //forward rejected promise 
    }
}

//---------helper functions------------------------------------------

export function priceForProduct(data){
    if (data.sale > 0){
        let newPrice = ""; 
        newPrice = Math.round(data.price * (1- (data.sale/100))); 
        return newPrice; 
    }else{
        return data.price; 
    }}
    
//-------------------------------------------------------------------
export function calculateTotalPrice(shoppingCart){
    let totalPrice = 0; 

    for (let value of shoppingCart){
        let product = value.product; 

        let priceProduct = priceForProduct(product); 
        let individualProduct = ""; 
        individualProduct = priceProduct * value.quantity; 

        totalPrice = individualProduct + totalPrice; 
    } 
    return totalPrice; 
}

//-------------------------------------------------------------------
export function formatStock(product, quantity){
    let delivery = new Date(product.delivery).toLocaleDateString("en-GB", { day: "numeric", month: "numeric", year: "numeric"})

    if(product.stock < 1){
        let deliveryMsg = "The product is not in stock at the moment. The item will therfor arrive at " + delivery ;
        return deliveryMsg; 

    }else if(quantity>product.stock){
        return "You have ordered more than we have in stock.The item will therfor arrive at " + delivery ;

    }else if(quantity == undefined){
    return "Stock: " + product.stock;
    
    }else{
        return " "; 
    }
}

//------------------------------------------------------------------------

export function createBasicAuthString(username, password) {
    let combinedStr = username + ":" + password;
    let b64Str = btoa(combinedStr);
    return "basic " + b64Str; //return the basic authentication string
}