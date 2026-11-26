
export class CategoryView extends HTMLElement {

    //-----------------------------

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: "open"});
    }

    //-----------------------------

    refresh(data) { 
        
        

        if (!data) {return} //if an error is catched in api_service               

        btnChangeProduct.addEventListener("click", function(evt){
            const adminProdEdit = new CustomEvent("adminProdEdit", {composed:true, bubbles:true});
            this.dispatchEvent(adminProdEdit);
            console.log("product edit")
        })


        for (let value of data) {            
            const div = document.createElement("div");
            div.innerHTML = `
                <h2>${value.catName}</h2>
                <p>${value.catDescr}</p><hr>               
            `;
            this.shadow.appendChild(div);

            div.addEventListener('click', evt => {
                const catEvt = new CustomEvent("categoryselect", {composed: true, bubbles:true});
                catEvt.categoryData = value;
                this.shadow.dispatchEvent(catEvt);
            });
        }
    }
}

//===============================================

export class ProductView extends HTMLElement {

    //--------------------------------------------

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: "open"});
    }

    //-------------------------------------------

    refresh(data) {


        if (!data) {return} //if an error is catched in api_service         

        this.shadow.innerHTML = "";

        //----------------------------------------

        const btnAddProduct = document.createElement("button");
        btnAddProduct.innerHTML = "Add product"

        const btnMenu = document.createElement("button")
        btnMenu.innerHTML = "Menu"

        this.shadow.appendChild(btnMenu)
        this.shadow.appendChild(btnAddProduct);

        //-----------------------------------------

        btnMenu.addEventListener("click", async function(evt) {
            const backToMenuEvent = new CustomEvent('backToMenuBtn', {composed:true, bubbles:true})
            this.dispatchEvent(backToMenuEvent);
        })

        //-----------------------------------------

        btnAddProduct.addEventListener("click", async function (evt) {
            const btnAddProd = new CustomEvent("btnAddProduct", {composed: true, bubbles:true});
            this.dispatchEvent(btnAddProd)
            console.log("add product")
        })

        //------------------------------------------

        for (let value of data) {            
            const div = document.createElement("div");
            const btnChange = document.createElement("button")
            const btnDelete = document.createElement("button");
            let productId = value.id;

            btnChange.innerHTML = "Change"
            btnDelete.innerHTML = "Delete"

            //---------------------------------------

            div.innerHTML = `
                <hr>
                <h2>${value.name}</h2>
                <p>${value.descr}</p>
                <p>kr ${value.price},-</p>
            `;

            //---------------------------------------

            btnChange.addEventListener("click", async function(evt) {
                const btnChangeClick = new CustomEvent('changeBtnClick', {composed:true, bubbles:true, detail:productId});
                this.dispatchEvent(btnChangeClick);
                console.log("change clicked")
                console.log(productId)
            })

            //----------------------------------------

            btnDelete.addEventListener("click", async function(evt) {
                const deleteEvent = new CustomEvent('deleteBtnClick', {composed:true, bubbles:true, detail:productId})
                this.dispatchEvent(deleteEvent);
                console.log("delete btn")
            } )

            //-----------------------------------------
            
            this.shadow.appendChild(div);
            this.shadow.appendChild(btnChange);
            this.shadow.appendChild(btnDelete);
        }
    }
}

//===============================================

export class ProductForm extends HTMLElement {

    //-----------------------------

    constructor() {
        super();

        this.shadow = this.attachShadow({mode: "open"});

        //-----------------------------

        this.shadow.innerHTML = `
            <h2>Product form</h2>
            <hr>
            <form id="theForm">
                <input name="name" placeholder="Product name"><br>
                <input name="description" placeholder="description"><br>
                <input name="catID" placeholder="Category ID (1-7)"><br>
                <input name="heading" placeholder="Details"><br>
                <input name="price" placeholder="Price"><br>
                <input name="img_file" type="file"><br><hr>
                
                <input type="submit" value="Add product" id="btnForm">
            </form>
        `;

        //-----------------------------

        const theForm = this.shadow.querySelector("#theForm");
        const btnProductView = document.createElement("button");
        btnProductView.innerHTML ="Products"
        const btnMenu = document.createElement("button");
        btnMenu.innerHTML ="Menu"

        //-----------------------------

        this.shadow.appendChild(btnProductView);
        this.shadow.appendChild(btnMenu);

        //-----------------------------

        btnProductView.addEventListener("click", async function(evt) {
            const productView = new CustomEvent("productView", {composed:true, bubbles:true});
            this.dispatchEvent(productView);
        })

        //------------------------------

        btnMenu.addEventListener("click", async function(evt) {
            const menuBtn = new CustomEvent("menuView", {composed:true, bubbles:true});
            this.dispatchEvent(menuBtn);
        })

        //------------------------------

        theForm.addEventListener('submit', evt => {
            evt.preventDefault();
            const addProdEvent = new CustomEvent("addproduct", {composed: true, bubbles: true});
            addProdEvent.productForm = new FormData(theForm);

            //---------------------------

            const changeProdEvent = new CustomEvent("changeProduct", {composed:true, bubbles:true});
            changeProdEvent.productForm = new FormData(theForm);
           
            //---------------------------

            if(this.productID != null){
                changeProdEvent.productForm.append("id", this.productID);
                this.shadow.dispatchEvent(changeProdEvent)

            } else {
                this.shadow.dispatchEvent(addProdEvent);

            }
        });

        //--------------------------------

    }

    refresh(data){
        this.shadow.querySelector("#btnForm").value = "Change product"

        this.productID = data.id;

        let name = this.shadow.querySelector("[name=name]");
        name.value = data.name;

        let description = this.shadow.querySelector("[name=description]");
        description.value = data.descr;

        let catId = this.shadow.querySelector("[name=catID]")
        catId.value = data.catId;

        let heading = this.shadow.querySelector("[name=heading]")
        heading.value = data.id;

        let price = this.shadow.querySelector("[name=price]")
        price.value = data.price;

        //------------------------------------

        if(this.btnDelete == null){
                this.btnDelete = document.createElement("button");
                this.btnDelete.innerHTML = "Delete product";
                this.shadow.appendChild(this.btnDelete);

                this.btnDelete.addEventListener("click", evt => {
                const deleteEvent = new CustomEvent("deleteBtnForm", {composed:true, bubbles: true, detail: this.productID});
                this.dispatchEvent(deleteEvent);
                })
        }
    }

    //------------------------------------------

    resetForm(){
        this.shadow.querySelector("#theForm").reset();
        this.shadow.querySelector("#btnForm").value = "Add product"
        this.productID = null;
        
        if(this.btnDelete){
            this.btnDelete.remove();
            this.btnDelete = null;
        }

    }
}    

//===============================================

customElements.define("category-view", CategoryView);
customElements.define("product-view", ProductView);
customElements.define("product-form", ProductForm);