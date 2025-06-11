import { expect, test } from '@playwright/test';

test('create and fill out form', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Dynamic Form Builder' }),
  ).toBeVisible();
  await expect(page.getByText('Form Name')).toBeVisible();

  await page.getByRole('textbox', { name: 'Form Name' }).click();
  await page
    .getByRole('textbox', { name: 'Form Name' })
    .fill('This is my new Form');

  await page.getByRole('button', { name: 'Add Text Field field' }).click();

  await page.getByRole('button', { name: 'Validation Settings' }).click();
  await page
    .locator('label')
    .filter({ hasText: 'Required field' })
    .locator('div')
    .click();

  await page.getByRole('textbox', { name: 'Label' }).click();
  await page.getByRole('textbox', { name: 'Label' }).fill('Enter Name');

  await page.getByRole('button', { name: 'Add Number' }).click();

  await page
    .locator('section')
    .filter({ hasText: 'NUMBER' })
    .getByPlaceholder('Enter field label...')
    .click();

  await page
    .locator('section')
    .filter({ hasText: 'NUMBER' })
    .getByPlaceholder('Enter field label...')
    .fill('Enter Age');

  await page.getByRole('button', { name: 'Add Date' }).click();

  await page
    .locator('section')
    .filter({ hasText: 'DATE' })
    .getByPlaceholder('Enter field label...')
    .click();
  await page
    .locator('section')
    .filter({ hasText: 'DATE' })
    .getByPlaceholder('Enter field label...')
    .fill('Enter Date');

  await page
    .getByRole('button', { name: 'Validation Settings' })
    .nth(2)
    .click();

  await page.getByRole('button', { name: 'Add Dropdown Field field' }).click();

  await page
    .locator('section')
    .filter({
      hasText: 'DROPDOWN',
    })
    .getByPlaceholder('Enter field label...')
    .click();

  await page
    .locator('section')
    .filter({
      hasText: 'DROPDOWN',
    })
    .getByPlaceholder('Enter field label...')
    .fill('Select Option');

  await page.getByRole('textbox', { name: 'Enter option' }).click();
  await page.getByRole('textbox', { name: 'Enter option' }).fill('Option 1');

  await page.getByRole('textbox', { name: 'Add new dropdown option' }).click();
  await page
    .getByRole('textbox', { name: 'Add new dropdown option' })
    .fill('Option 2');
  await page
    .getByRole('textbox', { name: 'Add new dropdown option' })
    .press('Enter');
  await page
    .getByRole('textbox', { name: 'Add new dropdown option' })
    .fill('Option 3');
  await page
    .getByRole('textbox', { name: 'Add new dropdown option' })
    .press('Enter');
  await page.getByRole('button', { name: 'Save Form' }).click();
  await expect(
    page.getByRole('heading', { name: 'This is my new Form' }).first(),
  ).toBeVisible();

  await page.getByRole('link', { name: 'View Form' }).first().click();
  await page.waitForURL('/forms/1');

  await expect(
    page.getByRole('heading', { name: 'This is my new Form' }),
  ).toBeVisible();

  await page.getByRole('textbox', { name: 'Enter Name' }).fill('John Doe');
  await page.getByRole('spinbutton', { name: 'Enter Age' }).fill('30');
  await page.getByRole('textbox', { name: 'Enter Date' }).fill('2025-01-01');
  await page
    .getByRole('combobox', { name: 'Select Option' })
    .selectOption('Option 1');

  // Submit the form
  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().includes('/api/forms') &&
      response.request().method() === 'POST',
  );

  await page.getByRole('button', { name: 'Submit' }).click();

  const response = await responsePromise;

  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  expect(responseBody).toStrictEqual({
    message: 'Form submitted successfully',
  });
});
