// Search script from html doc
const vueApp = new Vue({
    el: '#main',
    data: { 
     searchbox: "",
     searchResults: [],
     cart: [],
     totalPrice: 0,
     totalItems: 0,
     productUpdate: [],
    },
  methods: {
   search() {
      if(this.searchbox != ""){
          ajaxGet("/api/productSearch/" + this.searchbox + "/", (callbackResponse) => {
          this.searchResults = callbackResponse.data
          }); 
      }
      else{
          alert("Please write something in the search box before searching")
      }
    },
    onProductItemClicked() {
        const unorderedListElement = document.getElementById("searchBody");
        const productIndex = getClickedListItemElement(event.target).rowIndex - 1;
        var productClicked = this.searchResults[productIndex];
        var quantity = prompt("Please enter amount to add to cart:");
        quantity = parseInt(quantity);
        if (quantity == null || quantity <= 0 || !Number.isInteger(quantity)) {
            alert("Please enter an amount greater than 0."); }
        else if (quantity > productClicked.count)
        {
            alert("Not enough products in stock.");
        }
         else {
            this.cart.push({"id": productClicked.id, "lookupCode": productClicked.lookupCode, "price": quantity * productClicked.price, "count": quantity, "quantityInStock": productClicked.count, "ppi": productClicked.price});
            

            // Stuff to update stock
            /* var count = 0;
            count = parseInt(unorderedListElement.rows[productIndex].cells[2].innerHTML.toString()) - quantity;
            count = count.toString();
            var countCell = document.getElementById("count");
            countCell.innerHTML = count; */
        }
        this.adjustTotals();
    },
    removeProductItem() {
        const unorderedListElement = document.getElementById("cartBody");
        const index = getClickedListItemElement(event.target).rowIndex - 1;
        this.cart.splice(index, 1);
        this.adjustTotals();
    },
    adjustTotals() {
        var table = document.getElementById("cartBody");
        var sumCell = document.getElementById("sum");
        var totalDollars = 0;
        var totalQuantity = 0;
        for (var i = 0; i < this.cart.length; i++) {
            totalDollars = totalDollars + this.cart[i].price;
            totalQuantity = totalQuantity + this.cart[i].count;
        }
        this.totalPrice = totalDollars;
        this.totalItems = totalQuantity;
    },
    changeQuantity() {
        const cartElement = document.getElementById("cartBody");
        const productIndex = getClickedListItemElement(event.target).rowIndex - 1;
        var productClicked = this.cart[productIndex];
        var quantity = prompt("Please enter new quantity:");
        quantity = parseInt(quantity);
        if (quantity == null || quantity <= 0 || !Number.isInteger(quantity)) {
            alert("Please enter an amount greater than 0.");
        } 
        else if (quantity > productClicked.quantityInStock)
        {
            alert("Not enough products in stock.");
        }
        else {
            this.cart[productIndex].count = quantity;
            this.cart[productIndex].price = quantity * this.cart[productIndex].ppi;
        }
        this.adjustTotals();
    },
    cancel() {
        // ajaxDelete('/api/transaction/$' + this.transactionId, response => {
            console.log("DELETE");
            // if (isSuccessResponse(response)) {
                window.location.replace('/mainMenu');
            // }
    },
    confirm() {

        saveTransactionRequest = {
            products: this.cart,
            totalPrice: this.totalPrice,
            totalItems: this.totalItems,
        }

        saveTransactionEntryRequest = {
            products: this.cart,
            totalPrice: this.totalPrice,
            totalItems: this.totalItems,
        }

        if (this.cart.length > 0) {
            ajaxPost("/api/transaction/", saveTransactionRequest, (callbackResponse) => {
                this.searchResults = callbackResponse.data
            });
            alert("Transaction completed. Close this window to return to main menu.");
            window.location.replace('/mainMenu');
        } else {
            alert("Please add items to cart to complete transaction.");
        }
    }
  }
})

document.getElementById("search")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("searchSubmit").click();
    }
});

function getClickedListItemElement(target) {
    let clickedElement = target;
    while (clickedElement.tagName !== "TR") {
        clickedElement = clickedElement.parentElement;
    }
    return clickedElement;
}

function getCancelButton() {
    return document.getElementById('cancelButton');
}

// STUFF BELOW THIS NOT NEEDED AND FOR REFERENCE ONLY
// DO NOT DELETE

// Listener for deleting items from cart
document.addEventListener("DOMContentLoaded", () => {
    // document.getElementById("addListItemAction")
        // .addEventListener("click", onAddListItemActionClicked);
    const listItemElements = document.getElementById("cart")
        .querySelectorAll("tbody");
    // for (let i = 0; i < listItemElements.length; i++) {
        // listItemElements[i].addEventListener("click", onListItemClicked);
    // }
});

function onListItemClicked(event) {
    const unorderedListElement = document.getElementById("cartBody");
    unorderedListElement.deleteRow(
        getClickedListItemElement(event.target).rowIndex - 1);
}

