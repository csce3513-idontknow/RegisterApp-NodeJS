function getClickedListItemElement(target) {
    let clickedElement = target;
​
    while (clickedElement.tagName !== "LI") {
        clickedElement = clickedElement.parentElement;
    }
​
    return clickedElement;
}
​
function onListItemClicked(event) {
    const unorderedListElement = document.getElementById("productsListing");
​
    unorderedListElement.removeChild(
        getClickedListItemElement(event.target));
}
​
function onAddListItemActionClicked() {
    const unorderedListElement = document.getElementById("productsListing");
    const nextEntryId = (unorderedListElement.childElementCount + 1).toString();
​
    const listItemElement = document.createElement("li");
    listItemElement.addEventListener("click", onListItemClicked);
​
    const lookupCodeDisplayElement = document.createElement("span");
    lookupCodeDisplayElement.innerHTML = ("Product Lookup Code " + nextEntryId);
    lookupCodeDisplayElement.classList.add("lookupCodeDisplay");
    listItemElement.appendChild(lookupCodeDisplayElement);
​
    listItemElement.appendChild(
        document.createElement("br"));
​
    const entryIdDisplayElement = document.createElement("span");
    entryIdDisplayElement.innerHTML = ("\u00A0\u00A0" + nextEntryId);
    listItemElement.appendChild(entryIdDisplayElement);
​
    unorderedListElement.appendChild(listItemElement);
}
​
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("addListItemAction")
        .addEventListener("click", onAddListItemActionClicked);
​
    const listItemElements = document.getElementById("productsListing")
        .querySelectorAll("li");
    for (let i = 0; i < listItemElements.length; i++) {
        listItemElements[i].addEventListener("click", onListItemClicked);
    }
});