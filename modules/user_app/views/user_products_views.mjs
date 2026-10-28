export class CategoryView extends HTMLElement{
    //----------------------------------------
    constructor(){
        super(); //calls constructor of parent(HTMLelement)
        this.shadow = this.attachShadow({mode: "open"});
    }

    //----------------------------------------
    refresh(data){
        if(!data) {return} //if an error is catched in api_services

        this.shadow.innerHTML = "";

        for(let value of data){
            //console.log("Category received by view:", value);
            //console.log("Category name:", value.catName);

            const div = document.createElement("div"); 
            div.innerHTML = `
                <h2>${value.catName}</h2>
                <p>${value.catDescr}</p><hr>               
            `;
            this.shadow.appendChild(div); 

            div.addEventListener(`click`, evt => {
                const catEvt = new CustomEvent("categoryselect", {composed: true, bubbles:true }); 
                catEvt.categoryData = value; 
                this.shadow.dispatchEvent(catEvt); 
            }); 
            //console.log("Rendered HTML:", this.shadow.innerHTML);
        }
    }
}
//==============================================
export class ListView extends HTMLElement{
    //------------------------------------------
    constructor(){
        super(); 
        this.shadow = this.attachShadow({mode: "open"});
    }

    refresh(data){
        if(!data) {return} //if an error is catched in api_services

        this.shadow.innerHTML = ""; 
        for(let value of data) {
            const div = document.createElement("div"); 

            //picture, name, and price
            div.innerHTML = `
                <h2>${value.name}</h2> 
                <p>kr ${value.price}-</p><hr>
            `;
            this.shadow.appendChild(div); 
        }
    }
}
//================================================
customElements.define("cat-view", CategoryView); 
customElements.define("prod-view", ListView); 