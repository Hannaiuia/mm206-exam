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
            rating: dataObj.rating,
            thumb:  dataObj.thumb, 
            image:  dataObj.image,
            stock:  dataObj.stock,
            sale:   dataObj.discount,
            delivery:dataObj.expected_shipped, 
            static: dataObj.static
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

//================================================
export class OrderModel{
    //---------------------------------------------
    constructor(order){
        this.data = this.convertObj(order); 
    }

    //----------------------------------------------
    convertObj(order){
        return{
            customer_name:  order.customerName,
            street:         order.street,
            city:           order.city,
            zipcode:        order.zipcode,
            country:        order.country,
            email:          order.email,
            phone:          order.phone,
            shipping_id:    order.shippingId, 
            content:        order.content
        }
    }
}

//====================================================
export class NewUserModel{
    //-----------------------------------------
    constructor(newUser){
        this.data = this.convertObj(newUser); 
    }
    //---------------------------------------
    convertObj(newUser){
        return{
            fullname:   newUser.name,
            street:     newUser.street,
            city:       newUser.city,
            zipcode:    newUser.zipcode,
            country:    newUser.country,
            email:      newUser.email,
            phone:      newUser.phone, 
            username:   newUser.username, 
            password:   newUser.password, 
            img_file:   newUser.picture
        }
    }

}