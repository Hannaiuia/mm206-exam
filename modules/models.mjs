/* this module contains the data structures (model-classes) used in the
application and functionality for converting incoming data from the server (there
is no requirement to convert outgoing data to the server). It is possible to divide
these into separate module files. If so, these should be in a separate folder
named models.*/

//=========================================
export class CategoryArrayModel {
    //---------------------------------------
    constructor(dataFromServer){
        this.data = []; 

        for(let dataObj of dataFromServer){
            const obj = this.convertObj(dataObj);
            this.data.push(obj); 
        }
    }

    //-----------------------------------
    convertObj(dataObj){
        return {
            id: dataObj.id, 
            catName: dataObj.category_name, 
            catDescr: dataObj.description
        }
    }
}

//============================================
export class ProductArrayModel{ //used instead of productmodel aswell 
    //----------------------------------------
    constructor(dataFromServer){

        this.data = []; 

        for(let dataObj of dataFromServer){
            const obj = this.convertObj(dataObj); 
            this.data.push(obj)
        }
    }
    //------------------------------------------
    convertObj(dataObj){
        return {
            id:     dataObj.id, 
            catId:  dataObj.category_id,
            catName:dataObj.category_name,
            name:   dataObj.chocoName,
            shortDescr: dataObj.shortDescr , 
            descr:  dataObj.descr, 
            price:  dataObj.price, 
            thumb:  dataObj.thumb, 
            image:  dataObj.image,
            stock:  dataObj.stock,
            sale:   dataObj.discount,
            delivery:dataObj.expected_shipped
        }
    }
}

//==============================================
export class ShippingMethodsArrayModel{
    //------------------------------------------
    constructor(dataFromServer){

        this.data = []; 

        for(let dataObj of dataFromServer){
            const obj = this.convertObj(dataObj); 
            this.data.push(obj)
        }
    }
    //----------------------------------------------
    convertObj(dataObj){
        return{
            id:     dataObj.id, 
            type:   dataObj.type, 
            price:  dataObj.price
        }
    }
}