import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8000/");
});

test("on page load, I see login form", async ({ page }) => {
  await expect(page.getByLabel("Login Button")).toBeVisible();
  await expect(page.getByLabel("Username Input")).toBeVisible();
  await expect(page.getByLabel("Password Input")).toBeVisible();
});

test("login using incorrect credentials", async ({ page }) => {
  await page.getByLabel("Username Input").fill("Not a User");
  await page.getByLabel("Password Input").fill("Not a Password");
  await page.getByLabel("Login Button").click();

  // If username Input is still visible, that means you're not logged in
  await expect(page.getByLabel("Username Input")).toBeVisible();

  // If incorrect credentials, you will NOT see the command REPL
  await expect(page.getByLabel("Command Input")).not.toBeVisible();
});

test("login using correct credentials", async ({ page }) => {
  await page.getByLabel("Username Input").fill("alex");
  await page.getByLabel("Password Input").fill("alex");
  await page.getByLabel("Login Button").click();

  // If logged in, username input should disappear
  await expect(page.getByLabel("Username Input")).not.toBeVisible();

  // If logged in, you will see the command input
  await expect(page.getByLabel("Command Input")).toBeVisible();
});

test("on page load, i dont see the input box until login", async ({ page }) => {
  // Notice: http, not https! Our front-end is not set up for HTTPs.
  await page.goto("http://localhost:8000/");

  await expect(page.getByLabel("Login Button")).toBeVisible();
  await expect(page.getByLabel("Username Input")).toBeVisible();
  await expect(page.getByLabel("Password Input")).toBeVisible();
  await expect(page.getByLabel("Command Input")).not.toBeVisible();

  await page.getByLabel("Username Input").fill("bob");
  await page.getByLabel("Password Input").fill("bob");
  await page.getByLabel("Login Button").click();

  await expect(page.getByLabel("Command Input")).toBeVisible();
  await expect(page.getByLabel("Login Button")).not.toBeVisible();
  await expect(page.getByLabel("Username Input")).not.toBeVisible();
  await expect(page.getByLabel("Password Input")).not.toBeVisible();
});

test("entering an invalid command causes error and doesn't add to history", async ({
  page,
}) => {
  // login
  await page.getByLabel("Username Input").fill("alex");
  await page.getByLabel("Password Input").fill("alex");
  await page.getByLabel("Login Button").click();

  await page.getByLabel("Command Input").fill("notacommand");
  await page.getByLabel("Submit Button").click();

  await expect(
    page.locator(
      "text=Invalid: Please enter a valid command (basic commands: load_file, view, search, mode)"
    )
  ).toBeVisible();
  await expect(page.getByLabel("boutput0")).not.toBeVisible();

  await page.getByLabel("Command Input").fill("view normal");
  await page.getByLabel("Submit Button").click();

  await expect(
    page.locator("text=Invalid: view should have no argruments (example: view)")
  ).toBeVisible();
  await expect(page.getByLabel("boutput0")).not.toBeVisible();
});

test("loading an invalid filepath", async ({ page }) => {
  // login
  await page.getByLabel("Username Input").fill("alex");
  await page.getByLabel("Password Input").fill("alex");
  await page.getByLabel("Login Button").click();

  // load_file notAFile
  await page.getByLabel("Command Input").fill("load_file notAFile");
  await page.getByLabel("Submit Button").click();

  await expect(
    page.locator("text=Invalid: The file 'notAFile' not found")
  ).toBeVisible();
});

test("loading a valid filepath", async ({ page }) => {
  await page.getByLabel("Username Input").fill("alex");
  await page.getByLabel("Password Input").fill("alex");
  await page.getByLabel("Login Button").click();

  await page.getByLabel("Command Input").fill("load_file normal");
  await page.getByLabel("Submit Button").click();

  await expect(
    page.locator("text=The file 'normal' was successfully loaded")
  ).toBeVisible();
});

test("loading with invalid number arguments", async ({ page }) => {
  await page.getByLabel("Username Input").fill("alex");
  await page.getByLabel("Password Input").fill("alex");
  await page.getByLabel("Login Button").click();

  await page.getByLabel("Command Input").fill("load_file too many args");
  await page.getByLabel("Submit Button").click();

  await expect(
    page.locator(
      "text=Invalid: load_file should have one argument (example: load_file <filepath>)"
    )
  ).toBeVisible();
});

test("viewing without loading", async ({ page }) => {
  await page.getByLabel("Username Input").fill("alex");
  await page.getByLabel("Password Input").fill("alex");
  await page.getByLabel("Login Button").click();

  await page.getByLabel("Command Input").fill("view");
  await page.getByLabel("Submit Button").click();

  await expect(page.locator("text=Invalid: No loaded csv file")).toBeVisible();
});

test("viewing with incorrect arguments", async ({ page }) => {
  await page.getByLabel("Username Input").fill("alex");
  await page.getByLabel("Password Input").fill("alex");
  await page.getByLabel("Login Button").click();

  await page.getByLabel("Command Input").fill("view not an argument");
  await page.getByLabel("Submit Button").click();

  await expect(
    page.locator("text=Invalid: view should have no argruments (example: view)")
  ).toBeVisible();
});

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

  const table = await page.getByLabel("btable1");

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

  const table = await page.getByLabel("btable1");

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

  const table2 = await page.getByLabel("btable3");

  for (let rowIndex = 0; rowIndex < expectedTableContent2.length; rowIndex++) {
    const expectedRowContents = expectedTableContent2[rowIndex];
    const rowSelector = `tr:nth-child(${rowIndex + 1})`;

    for (
      let cellIndex = 0;
      cellIndex < expectedRowContents.length;
      cellIndex++
    ) {
      await expect(
        table2.locator(`${rowSelector} > td:nth-child(${cellIndex + 1})`)
      ).toHaveText(expectedRowContents[cellIndex]);
    }
  }
});

test("searching after loading", async ({ page }) => {
  await page.getByLabel("Username Input").fill("alex");
  await page.getByLabel("Password Input").fill("alex");
  await page.getByLabel("Login Button").click();

  // load file normal
  await page.getByLabel("Command Input").fill("load_file noHeaders");
  await page.getByLabel("Submit Button").click();

  // view
  await page.getByLabel("Command Input").fill("search boston city");
  await page.getByLabel("Submit Button").click();

  const expectedTableContent = [
    ["847 Thayer", "Boston", "MA", "788477"],
    ["123 Main", "Boston", "MA", "68474"],
    ["169 Street", "Boston", "MA", "548470"],
  ];

  const table = await page.getByLabel("btable1");

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

test("searching before loading", async ({ page }) => {
  await page.getByLabel("Username Input").fill("alex");
  await page.getByLabel("Password Input").fill("alex");
  await page.getByLabel("Login Button").click();

  // search file without load
  await page.getByLabel("Command Input").fill("search ma 2");
  await page.getByLabel("Submit Button").click();
  await expect(page.locator("text=Invalid: No loaded csv file")).toBeVisible();
});

test("searching invalid search term", async ({ page }) => {
  await page.getByLabel("Username Input").fill("alex");
  await page.getByLabel("Password Input").fill("alex");
  await page.getByLabel("Login Button").click();

  // load file normal
  await page.getByLabel("Command Input").fill("load_file noHeaders");
  await page.getByLabel("Submit Button").click();

  // search file without load
  await page.getByLabel("Command Input").fill("search DNE DNE");
  await page.getByLabel("Submit Button").click();
  await expect(page.locator("text=No results for 'DNE DNE'")).toBeVisible();
});

test("searching invalid number of arguments", async ({ page }) => {
  await page.getByLabel("Username Input").fill("alex");
  await page.getByLabel("Password Input").fill("alex");
  await page.getByLabel("Login Button").click();

  // load file
  await page.getByLabel("Command Input").fill("load_file noHeaders");
  await page.getByLabel("Submit Button").click();

  // search with too many terms
  await page.getByLabel("Command Input").fill("search DNE DNE DNE");
  await page.getByLabel("Submit Button").click();
  await expect(
    page.locator(
      "text=Invalid: search should have two arguments (example: search <value> <column>)"
    )
  ).toBeVisible();
});

test("test mode changes", async ({ page }) => {
  await page.getByLabel("Username Input").fill("alex");
  await page.getByLabel("Password Input").fill("alex");
  await page.getByLabel("Login Button").click();

  // load file
  await page.getByLabel("Command Input").fill("load_file noHeaders");
  await page.getByLabel("Submit Button").click();

  // in brief mode, we expect boutput0 to be visible
  await expect(page.getByLabel("boutput0")).toBeVisible();

  // switch to verbose
  await page.getByLabel("Command Input").fill("mode");
  await page.getByLabel("Submit Button").click();

  // in verbose mode, we expect vcommand1 and voutput1 to be visible
  // and boutput0 to not be visible
  await expect(page.getByLabel("vcommand1")).toBeVisible();
  await expect(page.getByLabel("voutput1")).toBeVisible();
  await expect(page.getByLabel("boutput0")).not.toBeVisible();
});

test("test load, view, search, mode, and history size increment", async ({
  page,
}) => {
  await page.getByLabel("Username Input").fill("alex");
  await page.getByLabel("Password Input").fill("alex");
  await page.getByLabel("Login Button").click();

  // load file
  await page.getByLabel("Command Input").fill("load_file noHeaders");
  await page.getByLabel("Submit Button").click();

  // in brief mode, we expect boutput0 to be visible
  // ===== HISTORY ITEM #0 EXISTS ======
  await expect(page.getByLabel("boutput0")).toBeVisible();

  // switch to verbose
  await page.getByLabel("Command Input").fill("mode");
  await page.getByLabel("Submit Button").click();

  // ===== HISTORY ITEM #1 EXISTS ======
  await expect(page.getByLabel("vcommand1")).toBeVisible();
  await expect(page.getByLabel("voutput1")).toBeVisible();
  await expect(page.getByLabel("boutput0")).not.toBeVisible();

  // view file in verbose mode
  await page.getByLabel("Command Input").fill("view");
  await page.getByLabel("Submit Button").click();

  const expectedTableContent = [
    ["2553 West", "Los Angeles", "CA", "1773990"],
    ["918 Shelby", "Seattle", "WA", "913741"],
    ["1553 Broadway", "New York", "NY", "4373884"],
  ];

  // ===== HISTORY ITEM #2 EXISTS ======
  const table = await page.getByLabel("vtable2");

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

  // searching after loading
  await page.getByLabel("Command Input").fill("search boston city");
  await page.getByLabel("Submit Button").click();

  const expectedTableContent1 = [
    ["847 Thayer", "Boston", "MA", "788477"],
    ["123 Main", "Boston", "MA", "68474"],
    ["169 Street", "Boston", "MA", "548470"],
  ];

  // ===== HISTORY ITEM #3 EXISTS ======
  const table1 = await page.getByLabel("vtable3");

  for (let rowIndex = 0; rowIndex < expectedTableContent1.length; rowIndex++) {
    const expectedRowContents = expectedTableContent1[rowIndex];
    const rowSelector = `tr:nth-child(${rowIndex + 1})`;

    for (
      let cellIndex = 0;
      cellIndex < expectedRowContents.length;
      cellIndex++
    ) {
      await expect(
        table1.locator(`${rowSelector} > td:nth-child(${cellIndex + 1})`)
      ).toHaveText(expectedRowContents[cellIndex]);
    }
  }

  // ===== HISTORY ITEM #4 DOES NOT EXIST =====
  await expect(page.getByLabel("vcommand4")).not.toBeVisible();
  await expect(page.getByLabel("vtable4")).not.toBeVisible();
});
