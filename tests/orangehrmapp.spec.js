import { test, expect } from '@playwright/test';
import fs from 'fs'
import { parse } from 'csv-parse/sync';
const playwright = require('playwright');
//const { firefox } = require('playwright');
const records = parse(fs.readFileSync('testdata/data.csv'), {
  columns: true,
  skip_empty_lines: true
});
let size = records.length

//command used to execute tags  npx playwright test --grep EmployeeAdd 
//command used to execute in UI timeine mode npx playwright test ./tests/orangehrmapp.spec.js --ui

test('Add Employee', { tag: ['@EmployeeAdd'] },  async ({ page }) => {

  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.getByPlaceholder('username').click();
  await page.getByPlaceholder('username').fill('Admin');
  await page.getByPlaceholder('username').press('Tab');
  await page.getByPlaceholder('password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  for (let count = 0; count < size; count++) {
    test.slow();
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.getByRole('link', { name: 'Add Employee' }).click();
    await page.getByPlaceholder('First name').click();
    await page.getByPlaceholder('First name').fill(records[count].fname);
    await page.getByPlaceholder('Middle name').fill(records[count].mname);
    await page.getByPlaceholder('Last Name').fill(records[count].lname);
    await page.locator('form span').click();
    await page.locator('div:nth-child(4) > .oxd-grid-2 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').click();
    await page.locator('div:nth-child(4) > .oxd-grid-2 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').fill(records[count].username);
    await page.locator('input[type="password"]').first().click();
    await page.locator('input[type="password"]').first().fill(records[count].password);
    await page.locator('input[type="password"]').nth(1).click();
    await page.locator('input[type="password"]').nth(1).fill(records[count].password);
    await page.locator('input[type="file"]').setInputFiles(records[count].pic);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(10000);
    await page.getByRole('link', { name: 'Employee List' }).click();
    await page.locator('(//input[@placeholder="Type for hints..."])[1]').click;
    await page.locator('(//input[@placeholder="Type for hints..."])[1]').fill(records[count].fname);
    await page.getByRole('button', { name: 'Search' }).click();
    await page.getByText('(1) Record Found').click();
    const empID = await page.locator('(//div[@data-v-6c07a142=""])[1]').innerText();
    console.log("Employee ID: ", empID);
  }
});


test('Login to Orange HRM, Validate logged in user is string, Search for the Employee name and match a record ', {    tag: '@EmployeeSearch',  }, async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('username').click();
  await page.getByPlaceholder('username').fill('Admin');
  await page.getByPlaceholder('password').click();
  await page.getByPlaceholder('password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  const loggedInUser = await page.locator('.oxd-userdropdown-name').innerText();
  console.log(loggedInUser);
  await expect(page.locator('.oxd-userdropdown-name')).toHaveText(/.*?/);
  await page.getByRole('link', { name: 'PIM' }).click();
  console.log(records[0].fname)
  test.slow()
  await page.getByPlaceholder('Type for hints...').first().fill(records[0].fname);
  await page.getByRole('option', { name: records[0].fname+" "+records[0].mname+" "+records[0].lname }).click();
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByText('(1) Record Found').click();
  const recordsfound = await page.getByText('(1) Record Found').innerText();
  console.log(recordsfound);
  await expect(page.getByText('(1) Record Found')).toHaveText('(1) Record Found');
  ;})

  test.only('Create new user role and map to created employee', async ({ page }) => {
    test.slow
    await page.goto('https://opensource-demo.orangehrmlive.com');
    await page.getByPlaceholder('username').fill('Admin');
    await page.getByPlaceholder('password').fill('admin123');
    await page.getByPlaceholder('password').press('Enter');
    await page.getByRole('link', { name: 'Admin' }).click();
    await page.getByRole('button', { name: ' Add' }).click();
    await page.locator('form i').first().click();
    await page.getByRole('option', { name: 'Admin' }).click();
    await page.locator('form i').nth(1).click();
    await page.getByRole('option', { name: 'Enabled' }).click();
    await page.getByPlaceholder('Type for hints...').fill(records[0].fname+" "+records[0].mname+" "+records[0].lname);
    await page.getByText(records[0].fname+" "+records[0].mname+" "+records[0].lname).nth(0).click();
    await page.getByRole('textbox').nth(2).fill('admin123');
    await page.getByRole('textbox').nth(3).fill('welcome1');
    await page.getByRole('textbox').nth(4).click();
    await page.getByRole('textbox').nth(4).fill('welcome1');
    await page.getByRole('button', { name: 'Save' }).click();
  });
