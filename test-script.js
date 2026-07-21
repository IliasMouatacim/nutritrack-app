const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.toString());
  });
  page.on('console', msg => {
    if(msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text());
  });

  await page.goto('http://localhost:3000');
  await page.waitForSelector('.nav-item');
  
  console.log('Page loaded. Clicking Meal Tracker...');
  const navItems = await page.$$('.nav-item');
  if (navItems.length > 1) {
    await navItems[1].click(); // Click Meal Tracker
    await page.waitForTimeout(1000);
  }
  
  console.log('Clicking Water Tracker...');
  if (navItems.length > 2) {
    await navItems[2].click();
    await page.waitForTimeout(1000);
  }

  await browser.close();
  console.log('Done.');
})();
