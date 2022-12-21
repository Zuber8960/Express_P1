const cart_items = document.querySelector('#cart .cart-items');
let total_cart_price = document.querySelector('#total-value').innerText;

window.addEventListener('DOMContentLoaded', async () => {
    try {
        let responce = await axios.get("http://localhost:4000/products")
        if (responce.request.status === 200) {
            responce.data.forEach(element => {
                // console.log(element.id, element.title, element.price);
                showProductOnScreen(element);
            });
        }
    } catch (err) {
        console.log(err);
    }
});


const marchent = document.querySelector('#merch-content');
showProductOnScreen = (obj) => {
    const parentDiv = document.createElement('div');

    parentDiv.setAttribute('id', `id-${(obj.id)}`);
    parentDiv.innerHTML = `
        <h3>${obj.title}</h3>
        <div class="image-container">
            <img class="prod-images" src="${obj.imageUrl}" alt="">
        </div>
        <div class="prod-details">
            <span>$<span>${obj.price}</span></span>
            <button class="shop-item-button" type='button'>ADD TO CART</button>
        </div>`

    marchent.appendChild(parentDiv);
}

const parentContainer = document.getElementById('EcommerceContainer');
parentContainer.addEventListener('click', (e) => {

    //for clicking cart to show the products in cart and on click cancel will invisible.

    if (e.target.className == 'cart-btn-bottom' || e.target.className == 'cart-bottom' || e.target.className == 'cart-holder') {
        document.querySelector('#cart').style = "display:block;"
        showProductInCart();
        cart_items.innerHTML = "";
        total_cart_price = 0.00;
    }
    if (e.target.className == 'cancel') {
        document.querySelector('#cart').style = "display:none;"
        cart_items.innerHTML = "";
        total_cart_price = 0.00;
    }

    //when click button add to cart.
    if (e.target.className == 'shop-item-button') {
        let id = e.target.parentNode.parentNode.id;
        // const name = document.querySelector(`#${id} h3`).innerText;
        const name = e.target.parentNode.parentNode.firstElementChild.innerText;
        const img_src = document.querySelector(`#${id} img`).src;
        // const img_src = e.target.parentNode.classList.contains('prod-images').src;
        const price = e.target.parentNode.firstElementChild.firstElementChild.innerText;


        const productId = id.split("-")[1];
        console.log('id =', productId);
        axios.post("http://localhost:4000/cart", { productId: productId })
            .then((responce) => {

                if (responce.request.status === 200) {
                    // console.log(responce.data);
                    notifyOnScreen(responce.data.message);
                    let cartProduct = document.getElementById(`quantity-${productId}`);
                    // console.log('jjjj');
                    if (cartProduct) {
                        cartProduct.value = +(cartProduct.value) + 1;
                        console.log(cartProduct.id, cartProduct.value);
                        total_cart_price = (+(total_cart_price) + parseFloat(price)).toFixed(2);
                        document.querySelector('#total-value').innerText = `${total_cart_price}`;
                    } else {
                        console.log('new product is added to cart');
                        let newId = id.split("-")[1];
                        newId = `in-cart-${newId}`;
                        addNewProductInCart(newId, name, price, img_src, 1);
                        document.querySelector('.cart-number').innerText++;
                    }
                } else {
                    console.log(responce.data);
                }
            })
            .catch(err => {
                console.log('error');
                console.log(err);
                notifyOnScreen(err.message);
            });
    }


    //for click on purchase button functionality.
    if (e.target.className == 'purchase-btn') {
        if (parseInt(document.querySelector('.cart-number').innerText) === 0) {
            alert('You have Nothing in Cart , Add some products to purchase !');
            return;
        }
        alert('Thanks for the purchase')
        cart_items.innerHTML = ""
        document.querySelector('.cart-number').innerText = 0;
        document.querySelector('#total-value').innerText = `0.00`;
    }

    //for remove button functionality.
    if (e.target.innerText == 'REMOVE') {
        let productId = e.target.parentNode.parentNode.id;
        let qId = productId.split("-")[2];
        // let total_cart_price = document.querySelector('#total-value').innerText;
        total_cart_price = parseFloat(total_cart_price).toFixed(2) - (parseFloat(document.querySelector(`#${productId} .cart-price`).innerText) * parseFloat(document.getElementById(`quantity-${qId}`).value)).toFixed(2);
        document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText) - 1
        document.querySelector('#total-value').innerText = `${total_cart_price.toFixed(2)}`
        e.target.parentNode.parentNode.remove()
    }

})


//getting data from backend for cart by get request.
showProductInCart = async () => {
    try {
        let responce = await axios.get("http://localhost:4000/cart");

        if (responce.request.status === 200) {
            let numberOfProductsInCart = 0;
            await responce.data.products.forEach(ele => {
                addNewProductInCart(ele.id, ele.title, ele.price, ele.imageUrl, ele.cartItem.quantity);
                numberOfProductsInCart++;
            })
            document.querySelector('.cart-number').innerText = numberOfProductsInCart;
        } else {
            console.log(responce.data);
        }
    } catch (err) {
        console.log(err);
    }
}


//adding some functionallity and styling for that product which is added to cart.
function addNewProductInCart(id, title, price, imageUrl, quantity) {
    const cart_item = document.createElement('div');

    cart_item.classList.add('cart-row');
    cart_item.setAttribute('id', `in-cart-${id}`);
    const updatedPrice = price * quantity;

    total_cart_price = parseFloat(total_cart_price) + parseFloat(updatedPrice);
    total_cart_price = total_cart_price.toFixed(2);

    document.querySelector('#total-value').innerText = `${total_cart_price}`;
    cart_item.innerHTML = `
        <span class='cart-item cart-column'>
            <img class='cart-img' src="${imageUrl}" alt="">
            <span>${title}</span>
        </span>
        <span class='cart-price cart-column'>${price}</span>
        <span class='cart-quantity cart-column'>
            <input type="text" value="${quantity}" id="quantity-${id}">
            <button>REMOVE</button>
        </span>`
    cart_items.appendChild(cart_item);
}



function notifyOnScreen(massage) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `<h4>${massage}<h4>`;
    container.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000)
}