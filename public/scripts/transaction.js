// Search script from html doc
const vueApp = new Vue({
    el: '#main',
    data: { 
     searchbox: "",
     display: 'redbox',
     searchResults: [],
     cart: [],
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
            alert("Please enter an amount greater than 0.");
        } else {
            this.cart.push({"lookupCode": productClicked.lookupCode, "price": quantity * productClicked.price, "count": quantity});
        }
    },
    removeProductItem() {
        const unorderedListElement = document.getElementById("cartBody");
        const index = getClickedListItemElement(event.target).rowIndex - 1;
        this.cart.splice(index, 1);
    },
    adjustSum() {
        var table = document.getElementById("cartBody");
        var sumCell = document.getElementById("sum");
        var total = 0;
        for (var r = 0, n = table.rows.length; r < n; r++) {
            total = total + parseInt(table.rows[r].cells[1].innerHTML.replace(/\$|,/g, ''));
        }
        total = "$" + total.toString();
        sumCell.innerHTML = total;
    },
    cancel() {
        ajaxDelete('/api/transaction/${transactionId}', response => {
            if (isSuccessResponse(response)) {
                window.location.replace('/mainMenu');
            }
        });
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

