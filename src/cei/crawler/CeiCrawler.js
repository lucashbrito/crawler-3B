const puppeteer = require('puppeteer');
const StockHistoryCrawler = require('./StockHistoryCrawler');
const DividendsCrawler = require('./DividendsCrawler');
const WalletCrawler = require('./WalletCrawler');
const typedefs = require("./typedefs");
const PuppeteerUtils = require('./PuppeteerUtils');
const { CeiCrawlerError, CeiErrorTypes } = require('./CeiCrawlerError')

class CeiCrawler {
    
    /** @type {boolean} */
    _isLogged = false;

    /** @type {puppeteer.Browser} */
    _browser = null;

    /** @type {puppeteer.Page} */
    _page = null;

    get username() { return this._username; }
    set username(username) { this._username = username; }

    get password() { return this._password; }
    set password(password) { this._password = password; }

    /** @type {typedefs.CeiCrawlerOptions} - Options for CEI Crawler and Puppeteer */
    get options() { return this._options; }
    set options(options) { this._options = options; }

    /**
     * 
     * @param {String} username - Username to login at CEI
     * @param {String} password - Password to login at CEI
     * @param {typedefs.CeiCrawlerOptions} options - Options for CEI Crawler and Puppeteer
     */
    constructor(username, password, options = {}) {
        this.username = username;
        this.password = password;
        this.options = options;
        this._setDefaultOptions();
    }

    _setDefaultOptions() {
        if (!this.options.trace) this.options.trace = false;
        if (!this.options.navigationTimeout) this.options.navigationTimeout = 90000;
    }

    async _login() {
        if (this._isLogged) return;

        if (this._browser == null)
            this._browser = await puppeteer.launch(this.options.puppeteerLaunch, {args: ['--no-sandbox', '--disable-setuid-sandbox']});

        /* istanbul ignore next */
        if ((this.options && this.options.trace) || false)
            console.log('Logging at CEI...');
            
        this._page = await this._browser.newPage();
        this._page.setDefaultNavigationTimeout(this.options.navigationTimeout);

        await this._page.goto('https://cei.b3.com.br/CEI_Responsivo/');

        await this._page.type('#ctl00_ContentPlaceHolder1_txtLogin', this.username, { delay: 10 });
        await this._page.type('#ctl00_ContentPlaceHolder1_txtSenha', this.password, { delay: 10 });
        await this._page.click('#ctl00_ContentPlaceHolder1_btnLogar');

        // Wait for one of these things to happen first
        await PuppeteerUtils.waitForAny([
            {
                id: 'nav',
                pr: this._page.waitForNavigation({ timeout: 1000 * 60 * 10 }) // 10 minutes tops
            },
            {
                id: 'fail',
                pr: this._page.waitForSelector('.alert-box')
            },
            {
                id: 'fail',
                pr: this._page.waitFor(this.options.navigationTimeout) // After the time specified, consider the login has failed
            },
            {
                id: 'wrongPassword',
                pr: new Promise((resolve) => {
                    this._page.on('dialog', async () => {
                        resolve();
                    });
                })
            }
        ]).then(async id => {
            if (id === 'fail') {
                await this.close();
                throw new CeiCrawlerError(CeiErrorTypes.LOGIN_FAILED, 'Login falhou');
            } else if (id === 'wrongPassword') {
                await this.close();
                throw new CeiCrawlerError(CeiErrorTypes.WRONG_PASSWORD, 'Senha inválida');
            }
        });

        this._isLogged = true;
    }

    /**
     * Returns the stock history
     * @param {Date} [startDate] - The start date of the history
     * @param {Date} [endDate]  - The end date of the history
     * @returns {typedefs.StockHistory[]} - List of Stock histories
     */
    async getStockHistory(startDate, endDate) {
        await this._login();
        const r = await StockHistoryCrawler.getStockHistory(this._page, this.options, startDate, endDate);
        return r;
    }

    /**
     * @returns {typedefs.DividendData} - List of available Dividends information
     */
    async getDividends() {
        await this._login();
        const r = await DividendsCrawler.getDividends(this._page);
        return r;
    }

    /**
     * @returns {typedefs.DividendData} - List of available Dividends information
     */
    async getWallet(date) {
        await this._login();
        return await WalletCrawler.getWallet(this._page, this.options, date);
    }

    /**
     * Close puppeteer browser instance in order to free memory
     */
    async close() {
        if (this._browser != null) {
            await this._browser.close();
            this._browser = null;
        }
    }

}

module.exports = CeiCrawler;