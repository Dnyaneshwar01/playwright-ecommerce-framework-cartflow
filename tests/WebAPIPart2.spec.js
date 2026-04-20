const { test, expect } = require('@playwright/test');

let webContext;
const email = "starkindustrie8698@gmail.com";
test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/client");

    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').fill("Asite@987");
    await page.locator('#login').click();

    await page.waitForLoadState('networkidle');
    await context.storageState({ path: 'state.json' });
    webContext = await browser.newContext({ storageState: 'state.json' });

})

test('Browser Context - Validating client app functionality', async () => {

     const productName = "iphone 13 pro";
    const page = await webContext.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    const products = page.locator("[class='card-body']");
    await page.locator("div[class='card-body'] b").first().waitFor();
    const titles = await page.locator("div[class='card-body'] b").allTextContents();
    console.log(titles);

    const count = await products.count();

    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('load');

    for (let i = 0; i < count; ++i) {
        const productTitle = await products.nth(i).locator("b").textContent();
        if (productTitle.includes(productName)) {
            await products.nth(i).locator('button:has-text(" Add To Cart")').click();
            break;
        }
    }

    await page.locator("button[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();

    const bool = await page.locator("h3:has-text('iphone 13 pro')").isVisible();
    await expect(bool).toBeTruthy();

    await page.locator("text=Checkout").click();
    await page.locator("input[placeholder='Select Country']").pressSequentially("ind", { delay: 200 });
    await page.waitForSelector("section[class*='results list-group']");

    const countrySelection = await page.locator("section[class*='results list-group'] button");
    const countryCount = await countrySelection.count();
    await console.log("count " + countryCount);

    for (let j = 0; j < countryCount; ++j) {
        const country = await countrySelection.nth(j).locator("span").textContent();
        if (country === " India") {
            await countrySelection.nth(j).locator("span i").click();
            break;
        }
    }

    expect(await page.locator("[class*='user__name'] label[type='text']")).toHaveText(email);
    await page.locator("//div[text()='CVV Code ']/following-sibling::input").fill("1234");
    await page.locator("//div[text()='Name on Card ']/following-sibling::input").fill("Tony stark");
    await page.locator("a[class*='action__submit']").click();
    await page.waitForTimeout(3000);

    const thankyouMsg = await page.locator("text=' Thankyou for the order. '").isVisible();
    await expect(thankyouMsg).toBeTruthy();

    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    const orderID = await page.locator("td[class*='em-spacer'] label[class='ng-star-inserted']").textContent();
    console.log(`order id : ${orderID}`);

    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();

    await page.waitForSelector("tbody tr");
    const rows = await page.locator("tbody tr");

    const rowCount = await rows.count();
    await console.log("rowCount " + rowCount);

    for (let k = 0; k < rowCount; ++k) {
        const rowOrderId = await rows.nth(k).locator("th").textContent();
        await page.waitForTimeout(3000);

        if (orderID.includes(rowOrderId)) {
            await rows.nth(k).locator('button').first().click();
            break;
        }
    }
    const orderDetails = await page.locator("div[class='col-text -main']").textContent();
    await expect(orderID.includes(orderDetails)).toBeTruthy();
})