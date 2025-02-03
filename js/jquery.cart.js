
let btnLocation = document.getElementById('open_cart_btn');
let cartCounter = document.querySelector('.open_cart_number');


function formatterCart (priceSum) {
    let price = priceSum.toString();
    let formattedPrice = '';
    for (let i = 0; i < price.length; i++) {
        if (i > 0 && i % 3 === 0) {
            formattedPrice = ' ' + formattedPrice;
        }
        formattedPrice = price[price.length - 1 - i] + formattedPrice;
    }
    return formattedPrice;
};



btnLocation.addEventListener('click', function() {
    const cart = getCart()

    const divElement = document.createElement('div');

    divElement.classList.add('jqcart_layout');
    let totalCost = 0;

    const cartItemsHtml = cart.map(item => {
        let itemTotal = item.price * item.quantity;
        totalCost += itemTotal;

        return `
        <ul class="jqcart_tbody" data-id="${item.code}">
            <li class="jqcart_small_td">
                <img src="${item.img}" alt="${item.title}">
            </li>
            <li>
                <div class="jqcart_nd">
                    <a href="${item.link}">${item.title}</a>
                </div>
            </li>
            <li></li>
            <li class="jqcart_price">${formatterCart(item.price)} тг</li>
            <li>
                <div class="jqcart_pm">
                    <input type="text" class="jqcart_amount" value="${item.quantity}" readonly>
                    <span class="jqcart_incr" data-code="${item.code}" data-incr="1">+</span>
                    <span class="jqcart_incr" data-code="${item.code}" data-incr="-1">-</span>
                </div>
            </li>
            <li class="jqcart_sum">${formatterCart(itemTotal)} тг</li>
        </ul>
        `;
    }).join('');


    divElement.innerHTML = `
        <div class="jqcart_content">
            <div class="jqcart_table_wrapper">
                <div class="jqcart_manage_order">
                
                    <ul class="jqcart_thead">
                        <li></li>
                        <li>ТОВАР</li>
                        <li></li>
                        <li>ЦЕНА</li>
                        <li>КОЛИЧЕСТВО </li>
                        <li>СТОИМОСТЬ</li>
                    </ul>
                    
                    ${cartItemsHtml}
                    
                </div>
            </div>
            
            <div class="jqcart_manage_block">
                <div class="jqcart_btn">
                    <button class="jqcart_open_form_btn">Оформить заказ</button>
                    <form class="jqcart_order_form" style="opacity: 0">
                        <input class="jqcart_return_btn" type="reset" value="Продолжить покупки">
                    </form>
                </div>
                <div class="jqcart_subtotal">Итого: <strong>${totalCost}</strong> тг</div>
            </div>
            
        </div>
    `;

    document.body.appendChild(divElement);

    document.querySelector('.jqcart_layout').addEventListener('click', function (e) {
        if (e.target.classList.contains('jqcart_layout')) {
            divElement.remove();
        }    
    });

    divElement.querySelectorAll('.jqcart_incr').forEach(btn => {
        btn.addEventListener('click', function () {
            let code = this.dataset.code;
            let incr = Number(this.dataset.incr);
            updateQuantity(code, incr);
        });
    });
});


document.addEventListener('click', function (e) {
    if (e.target.classList.contains('product_item_price_btn')) {
        const btn = e.target;
        const productElement = btn.closest('.product_item');
        
        const product = {
            link: productElement.querySelector('.product_item_content').getAttribute('href'),
            title: productElement.querySelector('.product_item_text h5').textContent.split('|')[0].trim(),
            price: parseInt(productElement.querySelector('.product_item_price_cost').textContent.replace(/\s/g, '')),
            img: productElement.querySelector('.product_item_img').getAttribute('src'),
            code: btn.getAttribute('data-code')
        };

        addToCart(product);
    }
});


function getCart() {
    return JSON.parse(sessionStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    sessionStorage.setItem('cart', JSON.stringify(cart));
}


function addToCart(product) {
    let cart = getCart();
    
    let existingItem = cart.find(item => item.code === product.code);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart(cart);
    updateCartCounter();
}

function updateQuantity(code, incr) {
    let cart = getCart();
    let item = cart.find(item => item.code === code);

    if (item) {
        item.quantity += incr;
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.code !== code);
        }
    }

    saveCart(cart);
    document.querySelector('.jqcart_layout')?.remove();
    btnLocation.click();
    updateCartCounter()
}




document.addEventListener('DOMContentLoaded', updateCartCounter);

function updateCartCounter() {
    const cart = getCart();
    cartCounter.textContent = cart.length;
    cartCounter.style.display = cart.length > 0 ? 'block' : 'none';
}
