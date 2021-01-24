const os = require('os')
const path = require('path')
const fs = require('fs-extra')

module.exports = {
    async delCookiesFile(key) {
        let cookieFile = path.join(os.homedir(), '.AutoSignMachine', 'cookieFile_' + key + '.txt')
        if (fs.existsSync(cookieFile)) {
            fs.unlinkSync(cookieFile)
        }
    },
    getCookies: (key) => {
        let cookieFile = path.join(os.homedir(), '.AutoSignMachine', 'cookieFile_' + key + '.txt')
        if (fs.existsSync(cookieFile)) {
            let cookies = fs.readFileSync(cookieFile).toString('utf-8')
            return cookies
        }
        return ''
    },
    saveCookies: (key, cookies, cookiesJar) => {
        let cookieFile = path.join(os.homedir(), '.AutoSignMachine', 'cookieFile_' + key + '.txt')
        let allcookies = {}
        if (cookies) {
            cookies.split('; ').map(c => {
                let item = c.split('=')
                allcookies[item[0]] = item[1] || ''
            })
        }
        if (cookiesJar) {
            cookiesJar.toJSON().cookies.map(c => {
                allcookies[c.key] = c.value || ''
            })
        }
        let cc = []
        for (let key in allcookies) {
            cc.push({
                key: key,
                value: allcookies[key] || ''
            })
        }
        fs.ensureFileSync(cookieFile)
        fs.writeFileSync(cookieFile, cc.map(c => c.key + '=' + c.value).join('; ')
        )
    }
}