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
    },
    resolveConfigFile: (file) => {
        if (file) {
            if (file.indexOf('/') === 0) {
                if (fs.existsSync(file)) {
                    throw new Error('-f指定的文件不存在')
                }
                return path.resolve(file)
            } else {
                return path.resolve(process.cwd(), file)
            }
        } else {
            throw new Error('-f需要指定配置文件参数')
        }
    }
}