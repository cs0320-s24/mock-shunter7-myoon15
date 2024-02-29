import { expect, test } from "@playwright/test";

/**
  The general shapes of tests in Playwright Test are:
    1. Navigate to a URL
    2. Interact with the page
    3. Assert something about the page against your expectations
  Look for this pattern in the tests below!
 */

// If you needed to do something before every test case...
test.beforeEach(async ({ page }) => {
    // ... you'd put it here.
    // TODO: Is there something we need to do before every test case to avoid repeating code?
    await page.goto("http://localhost:8000/");
});

/**
 * Don't worry about the "async" yet. We'll cover it in more detail
 * for the next sprint. For now, just think about "await" as something
 * you put before parts of your test that might take time to run,
 * like any interaction with the page.
 */
// test("on page load, I see login form", async ({ page }) => {
//     // Notice: http, not https! Our front-end is not set up for HTTPs.
//     // await page.goto("http://localhost:8000/");

//     await expect(page.getByLabel("Login Button")).toBeVisible();
//     await expect(page.getByLabel("Username Input")).toBeVisible();
//     await expect(page.getByLabel("Password Input")).toBeVisible();
// });

// test("login using incorrect credentials", async ({ page }) => {
//     await page.getByLabel("Username Input").fill("Not a User");
//     await page.getByLabel("Password Input").fill("Not a Password");
//     await page.getByLabel("Login Button").click();

//     // If username Input is still visible, that means you're not logged in
//     await expect(page.getByLabel("Username Input")).toBeVisible();

//     // If incorrect credentials, you will NOT see the command REPL
//     await expect(page.getByLabel("Command Input")).not.toBeVisible();
// });

// test("login using correct credentials", async ({ page }) => {
//     await page.getByLabel("Username Input").fill("alex");
//     await page.getByLabel("Password Input").fill("alex");
//     await page.getByLabel("Login Button").click();

//     // If logged in, username input should disappear
//     await expect(page.getByLabel("Username Input")).not.toBeVisible();

//     // If logged in, you will see the command input
//     await expect(page.getByLabel("Command Input")).toBeVisible();
// });

// test("on page load, i dont see the input box until login", async ({ page }) => {
//     // Notice: http, not https! Our front-end is not set up for HTTPs.
//     await page.goto("http://localhost:8000/");

//     await expect(page.getByLabel("Login Button")).toBeVisible();
//     await expect(page.getByLabel("Username Input")).toBeVisible();
//     await expect(page.getByLabel("Password Input")).toBeVisible();
//     await expect(page.getByLabel("Command Input")).not.toBeVisible();

//     await page.getByLabel("Username Input").fill("bob");
//     await page.getByLabel("Password Input").fill("bob");
//     await page.getByLabel("Login Button").click();

//     await expect(page.getByLabel("Command Input")).toBeVisible();
//     await expect(page.getByLabel("Login Button")).not.toBeVisible();
//     await expect(page.getByLabel("Username Input")).not.toBeVisible();
//     await expect(page.getByLabel("Password Input")).not.toBeVisible();
// });

// test("loading an invalid filepath", async ({ page }) => {
//     // login
//     await page.getByLabel("Username Input").fill("alex");
//     await page.getByLabel("Password Input").fill("alex");
//     await page.getByLabel("Login Button").click();

//     // load_file notAFile
//     await page.getByLabel("Command Input").fill("load_file notAFile");
//     await page.getByLabel("Submit Button").click();

//     await expect(
//         page.locator("text=The file 'notAFile' not found")
//     ).toBeVisible();
// });

// test("loading a valid filepath", async ({ page }) => {
//     await page.getByLabel("Username Input").fill("alex");
//     await page.getByLabel("Password Input").fill("alex");
//     await page.getByLabel("Login Button").click();

//     await page.getByLabel("Command Input").fill("load_file normal");
//     await page.getByLabel("Submit Button").click();

//     await expect(
//         page.locator("text=The file 'normal' was successfully loaded")
//     ).toBeVisible();
// });

// test("loading with invalid number arguments", async ({ page }) => {
//     await page.getByLabel("Username Input").fill("alex");
//     await page.getByLabel("Password Input").fill("alex");
//     await page.getByLabel("Login Button").click();

//     await page.getByLabel("Command Input").fill("load_file too many args");
//     await page.getByLabel("Submit Button").click();

//     await expect(
//         page.locator(
//             "text=Invalid args: load_file should have one argument (example: load_file <filepath>)"
//         )
//     ).toBeVisible();
// });

// test("viewing without loading", async ({ page }) => {
//     await page.getByLabel("Username Input").fill("alex");
//     await page.getByLabel("Password Input").fill("alex");
//     await page.getByLabel("Login Button").click();

//     await page.getByLabel("Command Input").fill("view");
//     await page.getByLabel("Submit Button").click();

//     await expect(page.locator("text=No loaded csv file")).toBeVisible();
// });

test("viewing after loading", async ({ page }) => {
    await page.getByLabel("Username Input").fill("alex");
    await page.getByLabel("Password Input").fill("alex");
    await page.getByLabel("Login Button").click();

    // load file normal
    await page.getByLabel("Command Input").fill("load_file noHeaders");
    await page.getByLabel("Submit Button").click();

    // view
    await page.getByLabel("Command Input").fill("view");
    await page.getByLabel("Submit Button").click();

    const expectedTableContent = [
        ["2553 West", "Los Angeles", "CA", "1773990"],
        ["918 Shelby", "Seattle", "WA", "913741"],
        ["1553 Broadway", "New York", "NY", "4373884"],
    ];

    const table = await page.getByLabel("table1");

    for (let rowIndex = 0; rowIndex < expectedTableContent.length; rowIndex++) {
        const expectedRowContents = expectedTableContent[rowIndex];
        const rowSelector = `tr:nth-child(${rowIndex + 1})`;

        for (
            let cellIndex = 0;
            cellIndex < expectedRowContents.length;
            cellIndex++
        ) {
            await expect(
                table.locator(`${rowSelector} > td:nth-child(${cellIndex + 1})`)
            ).toHaveText(expectedRowContents[cellIndex]);
        }
    }
});

test("loading twice then view", async ({ page }) => {
    await page.getByLabel("Username Input").fill("alex");
    await page.getByLabel("Password Input").fill("alex");
    await page.getByLabel("Login Button").click();

    // load file normal
    await page.getByLabel("Command Input").fill("load_file noHeaders");
    await page.getByLabel("Submit Button").click();

    // view
    await page.getByLabel("Command Input").fill("view");
    await page.getByLabel("Submit Button").click();

    const expectedTableContent = [
        ["2553 West", "Los Angeles", "CA", "1773990"],
        ["918 Shelby", "Seattle", "WA", "913741"],
        ["1553 Broadway", "New York", "NY", "4373884"],
    ];

    const table = await page.getByLabel("table1");

    for (let rowIndex = 0; rowIndex < expectedTableContent.length; rowIndex++) {
        const expectedRowContents = expectedTableContent[rowIndex];
        const rowSelector = `tr:nth-child(${rowIndex + 1})`;

        for (
            let cellIndex = 0;
            cellIndex < expectedRowContents.length;
            cellIndex++
        ) {
            await expect(
                table.locator(`${rowSelector} > td:nth-child(${cellIndex + 1})`)
            ).toHaveText(expectedRowContents[cellIndex]);
        }
    }

    // === SECOND FILE ===
    // load file normal
    await page.getByLabel("Command Input").fill("load_file normal");
    await page.getByLabel("Submit Button").click();

    // view
    await page.getByLabel("Command Input").fill("view");
    await page.getByLabel("Submit Button").click();

    const expectedTableContent2 = [
        ["address", "city", "state", "price"],
        ["847 Thayer", "Boston", "MA", "788477"],
        ["12 Waterman", "Providence", "RI", "627352"],
        ["772 Smith", "Richmond", "VA", "438728"],
    ];

    const table2 = await page.getByLabel("table3");

    for (
        let rowIndex = 0;
        rowIndex < expectedTableContent2.length;
        rowIndex++
    ) {
        const expectedRowContents = expectedTableContent2[rowIndex];
        const rowSelector = `tr:nth-child(${rowIndex + 1})`;

        for (
            let cellIndex = 0;
            cellIndex < expectedRowContents.length;
            cellIndex++
        ) {
            await expect(
                table2.locator(
                    `${rowSelector} > td:nth-child(${cellIndex + 1})`
                )
            ).toHaveText(expectedRowContents[cellIndex]);
        }
    }
});

// test("viewing after loading", async ({ page }) => {
//     await page.getByLabel("Username Input").fill("alex");
//     await page.getByLabel("Password Input").fill("alex");
//     await page.getByLabel("Login Button").click();

//     // load file normal
//     await page.getByLabel("Command Input").fill("load_file normal");
//     await page.getByLabel("Submit Button").click();

//     // view
//     await page.getByLabel("Command Input").fill("view");
//     await page.getByLabel("Submit Button").click();

//     const expectedRowContents = [
//         "address",
//         "city",
//         "state",
//         "price"
//     ];

//     const table = page.locator('table');

//     for (let i = 0; i < expectedRowContents.length; i++) {
//         await expect(
//             table.locator(`tr:nth-child(1) > td:nth-child(${i + 1})`)
//         ).toHaveText(expectedRowContents[i]);
//     }
// });

// test("after I type into the input box, its text changes", async ({ page }) => {
//     // Step 1: Navigate to a URL
//     await page.goto("http://localhost:8000/");
//     await page.getByLabel("Login").click();

//     // Step 2: Interact with the page
//     // Locate the element you are looking for
//     await page.getByLabel("Command input").click();
//     await page.getByLabel("Command input").fill("Awesome command");

//     // Step 3: Assert something about the page
//     // Assertions are done by using the expect() function
//     const mock_input = `Awesome command`;
//     await expect(page.getByLabel("Command input")).toHaveValue(mock_input);
// });

// test("on page load, i see a button", async ({ page }) => {
//     // TODO WITH TA: Fill this in!
// });

// test("after I click the button, its label increments", async ({ page }) => {
//     // TODO WITH TA: Fill this in to test your button counter functionality!
//     await page.goto("http://localhost:8000/");
//     await page.getByLabel("Login").click();

//     await expect(
//         page.getByRole("button", { name: "Submitted 0 times" })
//     ).toBeVisible();

//     await page.getByRole("button", { name: "Submitted 0 times" }).click();

//     await expect(
//         page.getByRole("button", { name: "Submitted 1 times" })
//     ).toBeVisible();
// });

// test("after I click the button, my command gets pushed", async ({ page }) => {
//     // TODO: Fill this in to test your button push functionality!
// });
