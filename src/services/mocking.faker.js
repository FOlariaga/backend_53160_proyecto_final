import { faker } from "@faker-js/faker"

const generateFakeProducts =  (qty) => {
    const products = [];
    const CATEGORY = ['electrodomestico', 'consola', 'accesorio'];

    for (let i = 0; i < qty; i++) {
        const title = faker.commerce.product();
        const price = faker.commerce.price({ min: 5000, max: 150000 });
        const stock = Math.round(Math.random() * 10);
        const code =  faker.string.alphanumeric(6);
        const category = CATEGORY[Math.floor(Math.random() * CATEGORY.length)];

        products.push({ title, price, stock, code, category});
    }

    return products;
}

export default generateFakeProducts