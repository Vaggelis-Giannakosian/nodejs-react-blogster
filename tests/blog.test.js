const Page = require('./helpers/page')
let page;

beforeEach(async () => {
    page = await Page.build()
    await page.goto('http://localhost:3000/');
})

afterEach(async () => {
    await page.close()
})

describe('When logged in', () => {

    beforeEach(async () => {
        await page.login();
        await page.waitForSelector('a.btn-floating.red');
        await page.click('a.red')
    })

    test('Can see blog create form', async () => {
        const label = await page.getContentsOf('form .title label')
        expect(label).toEqual('Blog Title')
    })

    describe('And using invalid inputs', () => {

        beforeEach(async () => {
            await page.click('form button[type="submit"]')
        })

        test('The form shows an error message', async () => {
            const titleErrorMessage = await page.$('.title > .red-text');
            expect(titleErrorMessage).not.toBeNull();

            const titleErrorElement = await page.getContentsOf('.title > .red-text')
            expect(titleErrorElement).toEqual('You must provide a value');

            const contentErrorMessage = await page.$('.content > .red-text');
            expect(contentErrorMessage).not.toBeNull();

            const contentErrorElement = await page.getContentsOf('.content > .red-text')
            expect(contentErrorElement).toEqual('You must provide a value');
        })
    })


    describe('And using invalid inputs', () => {
        beforeEach(async () => {
            await page.type('.title input', 'Another test blog');
            await page.type('.content input', 'Test blog content');
            await page.click('form button[type="submit"]')
        })

        test('The user is redirected to review screen', async () => {
            const titleErrorMessage = await page.getContentsOf('form h5');
            expect(titleErrorMessage).toEqual('Please confirm your entries')
        })

        test('A new blog post is added to Blog index screen', async () => {
            await page.click('form button.green')
            await page.waitForNavigation()

            expect(page.url()).toEqual('http://localhost:3000/blogs')

            const postTitle = await page.getContentsOf('.card-title')
            expect(postTitle).toEqual('Another test blog')

            const postContent = await page.getContentsOf('.card-content > p')
            expect(postContent).toEqual('Test blog content')
        })
    })

})

describe('When not logged in', () => {

    const actions = [
        {
            method: "get",
            path: "/api/blogs",
        },
        {
            method: "post",
            path: "/api/blogs",
            data: {title: 'Title', content: 'Content'}
        }
    ]

    test('Blog related actions are prohibited', async () => {
        const responses = await page.execRequests(actions)

        responses.forEach(response => {
            expect(response).toEqual({error:'You must log in!'})
        })
    })

})


