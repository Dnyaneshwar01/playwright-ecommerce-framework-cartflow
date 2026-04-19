const { test, expect, request } = require('@playwright/test');
import { APIUtils } from './utils/APIUtils';

const loginPayload = { userEmail: "starkindustrie8698@gmail.com", userPassword: "Asite@987" };
const orderPayload = { orders: [{ country: "Cuba", productOrderedId: "6960ea76c941646b7a8b3dd5" }] };

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
    await page.waitForSelector("button[routerlink*='myorders']");
    await page.locator("button[routerlink*='myorders']").click();

    await page.waitForSelector("tbody tr");
    const rows = await page.locator("tbody tr");

    const rowCount = await rows.count();
    await console.log("rowCount " + rowCount);

    for (let k = 0; k < rowCount; ++k) {
        const rowOrderId = await rows.nth(k).locator("th").textContent();
        await page.waitForTimeout(3000);

        if (response.orderId.includes(rowOrderId)) {
            await rows.nth(k).locator('button').first().click();
            break;
        }
    }
    const orderDetails = await page.locator("div[class='col-text -main']").textContent();
    await expect(response.orderId.includes(orderDetails)).toBeTruthy();
})