// create product class
class Product {
  constructor(name, price, imageUrl) {
    this.name = name;
    this.price = price;
    this.imageUrl = imageUrl;
  }
}
// create products and a shop
product1 = new Product("Apple", 0.88, "./Apple.jpg");
product2 = new Product("Banana", 0.56, "./Banana.jpg");
product3 = new Product("Mango", 2.54, "./mango.png");
product4 = new Product("Cherry", 4.58, "./Cherry.jpg");
product5 = new Product("Pomegranate", 3.02, "./pomegranate.jpg");
product6 = new Product("Watermelon", 0.40, "./Watermelon.jpg");
const shop = [product1, product2, product3, product4, product5, product6];

// get DOM element to fill
const userName = document.getElementById("userLogin");
const shopDisplay = document.querySelector(".shop");
const cartDisplay = document.querySelector(".cartDisplay");
const cartTotal = document.querySelector(".cartTotal");
const userGreeting = document.querySelector(".userGreeting");
const fontSelection = document.getElementById("fonts");
const sessionfont = sessionStorage.getItem("preferedFont");

//Allow to display the whole shop from the shop array
const createShop = (array) => {
  for (let element of array) {
    const article = document.createElement("article");
    article.classList.add("product")
    const imageOfArticle = document.createElement("img");
    imageOfArticle.setAttribute("src", `${element.imageUrl}`);
    imageOfArticle.setAttribute("width", "100px")
    imageOfArticle.setAttribute("alt", `${element.name}`)
    article.appendChild(imageOfArticle)
    const nameOfArticle = document.createElement("h2");
    nameOfArticle.innerText = `${element.name}`;
    article.appendChild(nameOfArticle)
    const priceOfArticle = document.createElement("p");
    priceOfArticle.innerText = `Price per lb: $ ${element.price}`;
    article.appendChild(priceOfArticle)
    const addToCartBtn = document.createElement("button");
    addToCartBtn.classList.add("buttonAddCart")
    addToCartBtn.innerText = "Add to Cart";
    article.appendChild(addToCartBtn)
    shopDisplay.appendChild(article)
  }
  addButtons = document.querySelectorAll(".buttonAddCart")
  addToCart()
}

//fonction to update the greeting message
const updateUserGreeting = () => {
  if (getUserNameFromCookie()) {
    const greeting = document.createElement("p");
    userGreeting.innerHTML = ""
    greeting.innerText = `Welcome back, ${getUserNameFromCookie()}!`;
    userGreeting.appendChild(greeting);
  } else {
    alert("No username found. Please enter your name.");
  }
}

//get username from cookie
const getUserNameFromCookie = () => {
  let cookie = document.cookie.split(";")
  cookie = cookie[0].split("=")
  return cookie[1]
}


// get user cart from local storage if there is one
if (JSON.parse(localStorage.getItem("savedCart"))) {
  userCart = JSON.parse(localStorage.getItem("savedCart"))
} else {
  userCart = []
}

//Add an article to the cart if already present increase the quantity 
const addToCart = () => {
  for (const button of addButtons) {
    button.addEventListener("click", () => {
      indexOfBtn = [...addButtons].indexOf(button)
      indexInCartOfArticle = isOnTheCart(userCart, shop[indexOfBtn].name)
      if (indexInCartOfArticle === -1) {
        const cartEntry = {
          product: shop[indexOfBtn],
          quantity: 1
        }
        userCart.push(cartEntry);
      } else {
        userCart[indexInCartOfArticle].quantity++
      }
      updateDisplay(userCart)
      localStorage.setItem("savedCart", JSON.stringify(userCart));
    })
  }

}

//Delete an article to the cart
const deleteFromCart = () => {
  const deleteButtons = document.querySelectorAll(".deletebtn")
  for (let button of deleteButtons) {
    button.addEventListener("click", () => {
      indexOfBtn = [...deleteButtons].indexOf(button)
      userCart.splice(indexOfBtn, 1)
      updateDisplay(userCart)
      localStorage.setItem("savedCart", JSON.stringify(userCart));
    })
  }

}

//Empty the display and repopulate it with the cart 
const updateDisplay = (cart) => {
  cartDisplay.innerHTML = "";
  cartTotal.innerHTML = "";
  displayCart(cart);
  if (cart.length === 0) {
    const emptyCart = document.createElement("p");
    emptyCart.innerText = "Your cart is empty"
    cartDisplay.prepend(emptyCart);
  }
}

//Take a cart and cheak if an article is inside if yes returm the index otherwise -1 
const isOnTheCart = (cart, article) => {
  for (const cartEntry of cart) {
    if (cartEntry.product.name === article) {
      return cart.indexOf(cartEntry)
    }
  }
  return -1
}

//Empty the cart and update local storage
const emptyTheCart = () => {
  userCart = []
  updateDisplay([])
  localStorage.setItem("savedCart", JSON.stringify(userCart));
}

//Display cart and total
displayCart = (cart) => {
  let total = 0
  for (let cartEntry of cart) {
    const deleteBtn = document.createElement("div");
    deleteBtn.classList.add("deletebtn");
    deleteBtn.innerText = "\u00D7"
    cartDisplay.appendChild(deleteBtn);
    const elementOfCart = document.createElement("p");
    elementOfCart.classList.add("elementOfCart");
    elementOfCart.innerText = `${cartEntry.quantity} lb(s) of ${cartEntry.product.name}`;
    cartDisplay.appendChild(elementOfCart);
    const elementOfTotal = document.createElement("p");
    elementOfTotal.innerText = `${cartEntry.product.name}: ${cartEntry.quantity} x $${cartEntry.product.price}= $${(cartEntry.quantity * cartEntry.product.price).toFixed(2)}`;
    cartTotal.appendChild(elementOfTotal);
    let elementTotal = cartEntry.quantity * cartEntry.product.price
    total += elementTotal
  }
  const finalTotal = document.createElement("h4");
  finalTotal.classList.add("elementOfCart")
  finalTotal.innerText = `Total: $${total.toFixed(2)}`;
  cartTotal.appendChild(finalTotal);
  const emptyCart = document.createElement("button");
  emptyCart.classList.add("emptyCart")
  emptyCart.innerText = "Empty Cart"
  cartDisplay.appendChild(emptyCart);
  emptyCart.addEventListener("click", () => { emptyTheCart() })
  deleteFromCart()
}

//This part was added thanks to online search as the service workers where not working if not registered
window.addEventListener('load', () => {
  navigator.serviceWorker.register('service-worker.js')
  alert("this page is using cached product images and styles to speed up loading time")
});

//Call functions to display short and cart
createShop(shop)
displayCart(userCart)
updateDisplay(userCart)
updateUserGreeting()

//Makes the user name input dynamic waiting for a new name to register it in cookies 
userName.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    if (userName.value === "") {
      alert("Please enter a valid name")
    } else {
      document.cookie = `username=${userName.value}; expires=Fri, 31 Dec 2025 23:59:59 GMT`;
      updateUserGreeting()
    }
    userName.value = ""
  }
})

//Check if a preference of font was made or is made save it in session storage
if (sessionfont) {
  fontSelection.value = sessionfont;
  document.body.style.fontFamily = sessionfont
}
fontSelection.addEventListener("change", () => {
  newfont = fontSelection.value
  document.body.style.fontFamily = newfont
  sessionStorage.setItem("preferedFont", newfont)
})


