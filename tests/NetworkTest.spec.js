const { test, expect, request } = require('@playwright/test');
import { APIUtils } from './utils/APIUtils';

const loginPayload = { userEmail: "starkindustrie8698@gmail.com", userPassword: "Asite@987" };
const orderPayload = { orders: [{ country: "Cuba", productOrderedId: "6960ea76c941646b7a8b3dd5" }] };
const mockPayloadOrder = { data: [], message: "No Orders" };

let response;
test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = await new APIUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload);
})

test("Create order via API and validate order visibility and details on UI", async ({ page }) => {

    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.goto("https://rahulshettyacademy.com/client");

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",

        async route => {
            const response = await page.request.fetch(route.request());
            let body = JSON.stringify(mockPayloadOrder)

            route.fulfill({
                response,
                body,
            })
        })

    await page.waitForSelector("button[routerlink*='myorders']");
    await page.locator("button[routerlink*='myorders']").click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");
    console.log(await page.locator(".mt-4").textContent())

})