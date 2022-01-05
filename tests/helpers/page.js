const puppeteer = require('puppeteer')
// const Page = require("puppeteer/lib/cjs/puppeteer/common/Page");
const userFactory = require("../factories/userFactory");
const sessionFactory = require("../factories/sessionFactory");

class CustomPage {

    static async build(){
        const browser = await puppeteer.launch({
            // headless: false
        })
        const [page] = await browser.pages()
        const customPage = new CustomPage(page);

        return new Proxy(customPage, {
            get: (target, property) => {
                return Reflect.get(target, property)
                    || Reflect.get(browser,property)
                    || Reflect.get(page, property)

            }
        })

    }

    constructor(page) {
        this.page = page
    }

    async login () {
        const user = await userFactory()
        const {session, sig} = sessionFactory(user)

        await this.page.setCookie({name: 'session', value: session})
        await this.page.setCookie({name: 'session.sig', value: sig})
        await this.page.reload();
    }

    async getContentsOf(selector){
        return await this.page.$eval(selector, el => el.innerHTML)
    }

}

module.exports = CustomPage
