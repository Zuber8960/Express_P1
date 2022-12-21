const cart_items = document.querySelector('#cart .cart-items');

window.addEventListener('DOMContentLoaded', async () => {
    try {
        let responce = await axios.get("http://localhost:4000/products")
        if (responce.request.status === 200) {
            responce.data.forEach(element => {
                // console.log(element.id, element.title, element.price);
                showProductOnScreen(element);
            });
        }

        let prom1 = await axios.get("http://localhost:4000/cart");

        let numberOfProductsInCart = 0;
        if(prom1.request.status===200){
            await prom1.data.products.forEach(ele => {
                numberOfProductsInCart++;
                showInCart(ele);
            })
        }
        document.querySelector('.cart-number').innerText = numberOfProductsInCart;

    }catch(err){
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

let total_cart_price = document.querySelector('#total-value').innerText;
showInCart = (obj) => {
    const id = obj.id;
    const title = obj.title;
    const price = obj.price;
    const imageUrl = obj.imageUrl;
    const quantity = obj.cartItem.quantity;

    const cart_item = document.createElement('div');
    
    cart_item.classList.add('cart-row');
    cart_item.setAttribute('id', `in-cart-${id}`);
    const updatedPrice = price*quantity;

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

const parentContainer = document.getElementById('EcommerceContainer');
parentContainer.addEventListener('click', (e) => {

    //for clicking cart to show on the screen and on click cancel will invisible.
    if (e.target.className == 'cart-btn-bottom' || e.target.className == 'cart-bottom' || e.target.className == 'cart-holder') {
        document.querySelector('#cart').style = "display:block;"
    }
    if (e.target.className == 'cancel') {
        document.querySelector('#cart').style = "display:none;"
    }

    //adding the product in cart functionality.
    if (e.target.className == 'shop-item-button') {
        let id = e.target.parentNode.parentNode.id;
        // const name = document.querySelector(`#${id} h3`).innerText;
        const name = e.target.parentNode.parentNode.firstElementChild.innerText;
        const img_src = document.querySelector(`#${id} img`).src;
        // const img_src = e.target.parentNode.classList.contains('prod-images').src;
        const price = e.target.parentNode.firstElementChild.firstElementChild.innerText;
        // let total_cart_price = document.querySelector('#total-value').innerText;
        //     if (document.querySelector(`#in-cart-${id}`)) {
        //         alert('This item is already added to the cart');
        //         return
        //     }
        //     document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText) + 1

        //     const cart_item = document.createElement('div');
        //     cart_item.classList.add('cart-row');
        //     cart_item.setAttribute('id', `in-cart-${id}`);
        //     total_cart_price = parseFloat(total_cart_price) + parseFloat(price);
        //     // total_cart_price = Math.ceil(total_cart_price);
        //     total_cart_price = total_cart_price.toFixed(2);
        //     document.querySelector('#total-value').innerText = `${total_cart_price}`;
        //     cart_item.innerHTML = `
        //     <span class='cart-item cart-column'>
        //     <img class='cart-img' src="${img_src}" alt="">
        //         <span>${name}</span>
        // </span>
        // <span class='cart-price cart-column'>${price}</span>
        // <span class='cart-quantity cart-column'>
        //     <input type="text" value="1" id="quantity-${id}">
        //     <button>REMOVE</button>
        // </span>`
        //     cart_items.appendChild(cart_item);

        //for notification whenever added a product in cart will be shown a notification here.
        const container = document.getElementById('container');
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.innerHTML = `<h4>Your Product : <span>${name}</span> is added to the cart<h4>`;
        container.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000)


        const productId = id.split("-")[1];
        console.log(productId);
        axios.post("http://localhost:4000/cart", { productId: productId })
            .then((responce) => {
                if (responce.request.status === 200) {
                    console.log(responce.data);
                    notifyOnScreen(responce.data.message);
                    let cartProduct = document.getElementById(`quantity-${productId}`);
                    // console.log('jjjj');
                    cartProduct.value= +(cartProduct.value) +1;
                    console.log(cartProduct.id, cartProduct.value);

                }
            })
            .catch(err => {
                console.log(err);
                notifyOnScreen(err.data.message);
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
        total_cart_price = parseFloat(total_cart_price).toFixed(2) - (parseFloat(document.querySelector(`#${productId} .cart-price`).innerText)*parseFloat(document.getElementById(`quantity-${qId}`).value)).toFixed(2);
        document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText) - 1
        document.querySelector('#total-value').innerText = `${total_cart_price.toFixed(2)}`
        e.target.parentNode.parentNode.remove()
    }

})



function notifyOnScreen(massage) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `<h4>${massage}<h4>`;
    container.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000)
}