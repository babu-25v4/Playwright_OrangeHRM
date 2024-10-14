const playwright = require('playwright');

async function globalSetup(config) {
    console.log('Setting up global browser context....')
    process.env.API_TOKEN='7c327ff525cbcdc68efcef20e536590cec6eece417b63f00167a39d297d5b6ce'
    const {storageState } = config.projects[0].use;
    global.browser = await playwright.chromium.launch();
    global.page = await browser.newPage();
    await page.context().storageState({ path: storageState});
}

export default globalSetup;
