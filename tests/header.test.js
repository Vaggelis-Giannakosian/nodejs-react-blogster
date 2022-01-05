const Page = require('./helpers/page')
let page;

beforeEach(async ()=>{
    page = await Page.build()
    await page.goto('http://localhost:3000/');
})

afterEach(async ()=>{
    await page.close()
})

test('The header logo has the correct text', async () => {
    const logoText = await page.getContentsOf('a.brand-logo')
    expect(logoText).toEqual('Blogster')
})

test('Clicking login starts oauth flow',async()=>{
    await page.click('.right a')
    expect(page.url()).toMatch(/^https:\/\/accounts\.google\.com\/.*/)
})

test('When signed in, shows logout button',async()=>{
    await page.login()
    await page.waitForSelector('a[href="/auth/logout"]')
    const logoutBtn = await page.getContentsOf('a[href="/auth/logout"]')
    expect(logoutBtn).toEqual('Logout')
})
