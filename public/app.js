const API_URL = 'http://localhost:3000';


const app = new Vue({
    el: '#app',
    data: {
        items: [],
        searchQuery: '',
        cart: [],
    },
    mounted() {
        fetch(`${API_URL}/products`)
        .then((response) => response.json())
        .then((items) => {
            this.items = items;
        });

    fetch(`${API_URL}/cart`) 
        .then((response) => response.json())
        .then((items) => {
            this.cart = items;
        });

    },
    computed: {
        filteredItems() {
            const regexp = new RegExp(this.searchQuery, 'i');
            return this.items.filter((item) => regexp.test(item.name))
        },
        totalAmount() {
            return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0 )
        }
    },
    methods: {
        handleBuyClick(item) {
            const cartItem = this.cart.find(cartItem => cartItem.id === item.id);
            if(cartItem) {
                fetch(`${API_URL}/cart/${item.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({quantity: cartItem.quantity + 1}),
                }).then((response) => response.json())
                .then((updated) {
                    const itemIdx = this.cart.findIndex(cartItem => cartItem.id === item.id);
                    Vue.set(this.cart, itemIdx, updated);
                });
            } else {
                fetch(`${API_URL}/cart`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({...item, quantity: 1}),
                }).then((response) => response.json())
                  .then((created) => {
                    this.cart.push(created);
                  });
            }
        }
    }
})