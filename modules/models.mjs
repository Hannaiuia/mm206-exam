
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
            content:        JSON.stringify(order.content)
        }
    }
}