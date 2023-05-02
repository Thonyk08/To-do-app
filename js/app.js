//****** CONSTANTS *******/

const alert = document.querySelector(".alert");
const form = document.querySelector(".app-form");
const duty = document.getElementById("add-duty");
const addBtn = document.querySelector(".add-btn");
const clearBtn = document.querySelector(".clear-btn");
const container = document.querySelector(".list-container");
const list = document.querySelector(".app-list");

// edit option
let editElement;
let editFlag = false;
let editID = "";

//***** EVENT LISTENERS ******//

form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems)
window.addEventListener("DOMContentLoaded", setupItems)

//***** FUNCTIONS  *****//

//add item
function addItem(e) {
    e.preventDefault();
    const value = duty.value;
    const id = new Date().getTime().toString();

    if(value && !editFlag){
        createListItem(id, value);

        //show clear button
        clearBtn.classList.remove("hidden");

        //add to local storage
        addToLocalStorage(id, value);

        //display alert
        displayAlert("Item succesfully added.", "success");

        //set back to default
        setBackTodefault();
    }
    else if(value && editFlag){
        
        editElement.innerHTML = value;
        editElement.parentElement.classList.remove("edited");

        //display alert
        displayAlert("Item changed...", "success");
                
        //edit local storage
        editLocalStorage(editID, value);

        //set back to default
        setBackTodefault();
    }
    else{
        displayAlert("Please, enter item...","danger");
    }
}

//alert
function displayAlert(text, type){
    alert.textContent = text;
    alert.classList.add(type);
    alert.classList.add("animate-add-alert");
    setTimeout(() => {
        alert.textContent = "";
        alert.classList.remove(type);
        alert.classList.remove("animate-add-alert");
    }, 2500);
    
};

//set back to defaut
function setBackTodefault(){
    duty.value = "";
    editFlag = false;
    editID = "";
    addBtn.textContent= "Add";
};

//clear items
function clearItems(){
    const items = document.querySelectorAll(".list-item");
    
    if(items.length>0){
        items.forEach(function(item){
            list.removeChild(item);
        })
    };
   
    clearBtn.classList.add("hidden");
    
    //remove from local storage
    localStorage.removeItem("duty list");
    
    //display aleret
    displayAlert("All items was cleared ... dude", "danger");

    //set back to default
    setBackTodefault();
}

//remove item

function removeItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;

    element.classList.remove("animate-add-item");
    element.classList.add("animate-remove-item");


    setTimeout(() => {
        list.removeChild(element);
    
    if(list.children.length===0){
        clearBtn.classList.add("hidden"); 
    };

    //remove from local storage
    removeFromLocalStorage(id);

    //display aleret
    displayAlert("Item deleted.");

    //set back to default
    setBackTodefault();
    }, 1500);

    
};

//edit item

function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    
    editElement = e.currentTarget.parentElement.previousElementSibling;

    duty.value = editElement.innerHTML;
    editFlag = true;
    editID= element.dataset.id;

    addBtn.textContent = "edit";
    element.classList.add("edited");
};

//******* LOCAL STORAGE ******/

// add to local storage
function addToLocalStorage(id, value){
    const duty = {id, value};
    let items = getLocalStorage();

    items.push(duty);
    localStorage.setItem("duty list", JSON.stringify(items));
}

function getLocalStorage(){
    return localStorage.getItem("duty list") ? JSON.parse(localStorage.getItem("duty list")) : [];
}

//remove from local storage
function removeFromLocalStorage(id){
    let items = getLocalStorage();

    items= items.filter(function(item){
        if(item.id !== id){
            return item;
        }
    })

    localStorage.setItem("duty list", JSON.stringify(items));
}

// edit local storage
function editLocalStorage(id, value){
    let items = getLocalStorage();

    items= items.map(function(item){
        if(item.id === id){
           item.value = value;
        }
        return item;
    })

    localStorage.setItem("duty list", JSON.stringify(items));
}

// SETUP LOCALSTORAGE.REMOVEITEM('LIST');

// ****** setup items **********

function setupItems() {
    let items = getLocalStorage();
  
    if (items.length > 0) {
      items.forEach(function (item) {
        createListItem(item.id, item.value);
      });
      container.classList.add("show-container");
    }
  }
  
  function createListItem(id, value) {
    const element = document.createElement("article");
        let attr = document.createAttribute("data-id");
        attr.value = id;
        element.setAttributeNode(attr);
        element.classList.add("list-item")
        element.innerHTML = `<p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fa fa-light fa-pencil"></i>
            </button>
            <button type="button" class="delete-btn">
                <i class="fa-sharp fa-solid fa-trash"></i>
            </button>
        </div>`;
        list.appendChild(element);

        const deleteBtn = element.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", removeItem);
        const editBtn = element.querySelector(".edit-btn");
        editBtn.addEventListener("click", editItem);

        clearBtn.classList.remove("hidden");
        element.classList.add("animate-add-item")
  }