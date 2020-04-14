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
        console.log("HELLO");
        var quantity = prompt("Please enter amount to add to cart:");
        quantity = parseInt(quantity);
        if (quantity == null || quantity <= 0 || !Number.isInteger(quantity)) {
            alert("Please enter an amount greater than 0.");
        } else {
            this.cart.push({"lookupCode": productClicked.lookupCode, "price": quantity * productClicked.price, "count": quantity});
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
// Listener for deleting items from cart
document.addEventListener("DOMContentLoaded", () => {
    // document.getElementById("addListItemAction")
        // .addEventListener("click", onAddListItemActionClicked);
    const listItemElements = document.getElementById("cart")
        .querySelectorAll("tbody");
    for (let i = 0; i < listItemElements.length; i++) {
        listItemElements[i].addEventListener("click", onListItemClicked);
    }
});

function onListItemClicked(event) {
    const unorderedListElement = document.getElementById("cartBody");
    unorderedListElement.deleteRow(
        getClickedListItemElement(event.target).rowIndex - 1);
}
function getClickedListItemElement(target) {
    let clickedElement = target;
    while (clickedElement.tagName !== "TR") {
        clickedElement = clickedElement.parentElement;
    }
    return clickedElement;
}
function onAddListItemActionClicked() {
    var table = document.getElementById("cartBody");
    var x = document.getElementById("cartBody").rows.length + 1;
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = x;
    cell2.innerHTML = "200";
    cell3.innerHTML = "$15";
    adjustSum();
}
function adjustSum() {
    var table = document.getElementById("cartBody");
    var sumCell = document.getElementById("sum");
    var total = 0;
    for (var r = 0, n = table.rows.length; r < n; r++) {
        total = total + parseInt(table.rows[r].cells[2].innerHTML.replace(/\$|,/g, ''));
    }
    total = "$" + total.toString();
    sumCell.innerHTML = total;
}