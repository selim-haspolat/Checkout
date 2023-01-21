const basketIcon = document.getElementById("basket-icon");
const basketMenu = document.querySelector(".basket-menu");
const xMark = document.querySelector(".fa-xmark");
const body = document.querySelector("body");
const products = document.getElementById("products");
const divSection = document.querySelectorAll(".sec");
const basketUl = document.getElementById("basket-ul");
const ul = document.getElementById("basket-ul");
const subtotal = document.getElementById("subtotal");
let priceSum = 0;
const tax = document.getElementById("tax");
const shipping = document.getElementById("shipping");
const total = document.getElementById("total");
const quantity = document.getElementById('quantity')

let basketList = JSON.parse(localStorage.getItem("basketList")) || [];

window.addEventListener("load", (e) => {
  getBasketListFromLocalStorage();
});

const getBasketListFromLocalStorage = () => {
  basketList.forEach((e) => {
    creatItem(e);
  });
  quantity.innerText = basketList.length
  quantity.innerText == 0 && (quantity.style.display = 'none')
};

basketIcon.addEventListener("click", (e) => {
  basketMenu.style.display = "block";
  basketMenu.style.backgroundColor = "white";
  body.style.backgroundColor = "#68a694a9";
  Array.from(products.children).forEach((d) => {
    d.style.opacity = ".6";
  });
});

xMark.addEventListener("click", (e) => {
  basketMenu.style.backgroundColor = "white";
  body.style.backgroundColor = "#68A694";
  basketMenu.style.display = "none";
  Array.from(products.children).forEach((d) => {
    d.style.opacity = "1";
  });
});

products.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("add") ||
    e.target.classList.contains("fa-plus")
  ) {
    const newItem = {
      id: new Date().getTime(),
      productName: e.target.closest("section").innerText.split("\n")[0],
      price: e.target.closest("section").innerText.split("\n")[1],
      oldPrice: e.target.closest("section").innerText.split("\n")[2],
      img: getComputedStyle(e.target.closest("section").querySelector(".img"))
        .backgroundImage,
      amount: 1,
    };

    let flag = false;
    if (basketList.length == 0) {
      basketList.push(newItem);
      creatItem(newItem);
      (quantity.innerText = Number(quantity.innerText) + 1)
      quantity.style.display = 'flex'
    } else {
      basketList.map(
        (x) => x.productName == newItem.productName && (flag = true)
      );
      flag || basketList.push(newItem);
      flag || creatItem(newItem);
      flag || (quantity.innerText = Number(quantity.innerText) + 1)
    }
    localStorage.setItem("basketList", JSON.stringify(basketList));
  }
});
const creatItem = (newItem) => {
  const { id, productName, price, oldPrice, img, amount } = newItem;

  const li = document.createElement("li");
  li.classList.add("basket-li");
  li.classList.add(id);
  divImg = document.createElement("div");
  divImg.classList.add("basket-img");
  divInfo = document.createElement("div");
  divInfo.classList.add("basket-info");
  h3 = document.createElement("h3");
  h3.innerText = productName;
  pricePar = document.createElement("p");
  priceSpan = document.createElement("span");
  priceSpan.classList.add('current-price')
  priceSpan.innerText = price;
  oldPriceSpan = document.createElement("span");
  oldPriceSpan.classList.add('old-price')
  oldPriceSpan.innerText = oldPrice;
  amountDiv = document.createElement("div");
  amountDiv.classList.add("amount-define");
  plus = document.createElement("i");
  plus.classList.add("fa-plus");
  amountText = document.createElement("span");
  amountText.innerText = amount;
  minus = document.createElement("i");
  minus.classList.add("fa-solid");
  minus.classList.add("fa-minus");
  removeButton = document.createElement("button");
  removeButton.classList.add("remove-btn");
  removeButton.innerText = "remove";
  productTotal = document.createElement("div");
  productTotalText = document.createElement("span");
  productTotalText.innerText = "Product Total: ";
  productTotalPrice = document.createElement("span");
  productTotalPrice.classList.add('product-total-price')
  productTotalPrice.innerText = (price.slice(1) * amount).toFixed(2);

  divImg.style.backgroundImage = img;

  priceSum += Number(productTotalPrice.innerText);
  resultCalculator()

  divInfo.appendChild(h3);
  divInfo.appendChild(pricePar);
  pricePar.appendChild(priceSpan);
  pricePar.appendChild(oldPriceSpan);
  amountDiv.appendChild(plus);
  amountDiv.appendChild(amountText);
  amountDiv.appendChild(minus);
  divInfo.appendChild(amountDiv);
  divInfo.appendChild(removeButton);
  productTotal.appendChild(productTotalText);
  productTotal.appendChild(productTotalPrice);
  divInfo.appendChild(productTotal);
  li.appendChild(divImg);
  li.appendChild(divInfo);
  ul.append(li);
};

products.addEventListener("mouseover", (e) => {
  if (e.target.id != "products") {
    e.target.closest("section").children[1].style.transform =
      "translateY(-12px)";
  }
});

products.addEventListener("mouseout", (e) => {
  if (e.target.id != "products") {
    e.target.closest("section").children[1].style.transform =
      "translateY(-55px)";
  }
});

ul.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    e.target.closest("li").remove();
    basketList = basketList.filter(
      (item) =>
        item.productName != e.target.closest("li").querySelector("h3").innerText
    );
    localStorage.setItem("basketList", JSON.stringify(basketList));
    priceSum = 0;
    basketList.forEach((i) => {
      priceSum += Number(i.price.slice(1) * i.amount);
    });
    (quantity.innerText = Number(quantity.innerText) - 1)
    quantity.innerText == 0 && (quantity.style.display = 'none')
    subtotal.innerText = priceSum.toFixed(2);
    tax.innerText = (Number(subtotal.innerText) * 0.18).toFixed(2)
    ul.children.length == 0 && (shipping.innerText = '0.00')
    total.innerText = (Number(subtotal.innerText) + Number(tax.innerText) + Number(shipping.innerText)).toFixed(2)
  } else if (e.target.classList.contains("fa-plus")) {
    amount = e.target.nextElementSibling;
    priceSum = 0;
    basketList.forEach((x) => {
      idCheck = e.target.closest("li").classList.contains(x.id)
      idCheck && (x.amount += 1);
      idCheck && (amount.innerText = x.amount);
      idCheck && (e.target.closest('li').querySelector('.product-total-price').innerText = (x.price.slice(1) * x.amount).toFixed(2))
      priceSum += x.price.slice(1) * x.amount
      
    });
    resultCalculator()
    subtotal.innerText = priceSum.toFixed(2);
    localStorage.setItem("basketList", JSON.stringify(basketList));
  } else if (e.target.classList.contains("fa-minus")) {
    amount = e.target.previousElementSibling;
    priceSum = 0;
    amount.innerText > 1 ? (newAmount = amount.innerText--) : (newAmount = 1);
    basketList.forEach((x) => {
      idCheck = e.target.closest("li").classList.contains(x.id)
      x.amount > 1 &&
        e.target.closest("li").classList.contains(x.id) &&
        (x.amount -= 1);
        idCheck && (e.target.closest('li').querySelector('.product-total-price').innerText = (x.price.slice(1) * x.amount).toFixed(2))
        priceSum += x.price.slice(1) * x.amount
    });
    resultCalculator()
    subtotal.innerText = priceSum.toFixed(2);
    localStorage.setItem("basketList", JSON.stringify(basketList));
  }
});

function resultCalculator(){
  subtotal.innerText = priceSum.toFixed(2);
  tax.innerText = (subtotal.innerText* 0.18).toFixed(2)
  subtotal != '0.00' && (shipping.innerText = '15.00')
  total.innerText = (Number(subtotal.innerText) + Number(tax.innerText) + Number(shipping.innerText)).toFixed(2)
}
