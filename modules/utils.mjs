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