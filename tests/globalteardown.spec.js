async function tearDown(config) {
    console.log('Deallocating resources')
    await global.browser.close();
}
export default tearDown;