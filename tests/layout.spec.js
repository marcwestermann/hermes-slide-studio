import { test, expect } from '@playwright/test';
test('canonical typesetting survives resize and print', async ({page}) => {
  await page.goto('http://127.0.0.1:18765');
  const measure = () => page.locator('.stage .slide').evaluate(el => ({width:el.offsetWidth,height:el.offsetHeight, fields:[...el.children].map(n=>({text:n.textContent,width:n.offsetWidth,height:n.offsetHeight,font:getComputedStyle(n).fontSize}))}));
  const initial = await measure();
  expect(initial.width).toBe(1280);
  expect(initial.height).toBe(720);
  await page.setViewportSize({width:600,height:900});
  await expect.poll(measure).toEqual(initial);
  await page.emulateMedia({media:'print'});
  const printed = await page.locator('.printslides .slide').first().evaluate(el => ({width:el.offsetWidth,height:el.offsetHeight, fields:[...el.children].map(n=>({text:n.textContent,width:n.offsetWidth,height:n.offsetHeight,font:getComputedStyle(n).fontSize}))}));
  expect(printed).toEqual(initial);
});
