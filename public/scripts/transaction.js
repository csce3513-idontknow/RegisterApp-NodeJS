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