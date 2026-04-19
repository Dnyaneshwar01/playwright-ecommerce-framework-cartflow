const { test, expect } = require('@playwright/test');

test('Browser Context - Validating Error login', async ({ browser }) => {

   const context = await browser.newContext();
   const page = await context.newPage();
   await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

   const userName = page.locator("#username");
   const password = page.locator("#password");
   const signIn = page.locator("#signInBtn");

   await userName.fill("rahulShetty");
   await password.fill("learning");
   await signIn.click();

   console.log(await page.locator("div[style*='block']").textContent());

   await expect(page.locator("div[style*='block']")).toContainText("Incorrect");

   await userName.fill("rahulshettyacademy");
   await password.fill("Learning@830$3mK2");
   await signIn.click();

})

test('UI Controls', async ({ browser }) => {

   const browserContext = await browser.newContext();
   const page = await browserContext.newPage();
   await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

   // dropdown handling
   const loginTypeLocator = page.locator("select[class='form-control']");
   await loginTypeLocator.selectOption("consult");

   // Hardcoded wait
   page.waitForTimeout(5000);

   //Radio button handling
   await page.locator("input[value='user']").click();
   await page.locator("#okayBtn").click();
   await expect(page.locator("input[value='user']")).toBeChecked();

   // Checkbox handling
   await page.locator("#terms").click();
   await expect(page.locator("#terms")).toBeChecked();

   await page.locator("#terms").uncheck();
   expect(await page.locator("#terms").isChecked()).toBeFalsy();

   await page.locator("//a[contains(text(),'Free Access to InterviewQue')]").click();
})

test('Child windows Handling ', async ({ browser }) => {

   const browserContext = await browser.newContext();
   const page = await browserContext.newPage();

   await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
   const documentLink = page.locator("a[href*='documents-request']");

   // Handling child browser
   const [newPage] = await Promise.all([
      browserContext.waitForEvent('page'),
      documentLink.click()
   ]);

   const text = await newPage.locator("p[class='im-para red']").textContent();
   console.log("text form newly open page: " + text);

   const domain = text.split("@")[1].split(" ")[0];
   console.log("Domain name : " + domain);

   const userName = page.locator("#username");
   await userName.fill(domain);
   console.log(await userName.inputValue());
})

// Playwright special locators

test('Playwright Special Locators', async({page}) => {

   await page.goto("https://rahulshettyacademy.com/angularpractice/");
   await page.getByLabel("Check me out if you Love IceCreams!").click();
   await page.getByLabel("Employed").check();
   await page.getByLabel("Gender").selectOption("Female");
   await page.getByPlaceholder("Password").fill("abd1234");
   await page.getByRole("button", {name:'Submit'}).click();
   await page.getByText(" The Form has been submitted successfully!.");

})

