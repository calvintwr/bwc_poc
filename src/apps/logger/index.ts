import Debug from 'debug'
import { relative } from 'path'

const LogBase = {
    appName: '',
    baseDir: '',
    namespace(fileName: string) {
        return `${this.appName}:${relative(this.baseDir, fileName)
            .replace(/\//g, ':')
            .replace(/\\/g, ':')}`
    },
    /**
     * Initialize LogBase. Can only be done once.
     * @param appName Name of the app. This is a prefix to the namespace. E.g. appName:namespace1:namespace2
     * @param baseDir Base directory of the app. This is required to diff the paths with other files to get a relative path for namespacing.
     */
    init(appName: string, baseDir: string) {
        if (this.appName.length > 0 || this.baseDir.length > 0)
            throw Error('LogBase can only be initialized once.')
        this.appName = appName
        this.baseDir = baseDir
        Object.freeze(this)
        return this
    },
}

/**
 * A centralised logging interface that will create namespaced debugger automatically using the file structure.
 * @param fileName Pass in `__filename`.
 */
const Log = (fileName: string) => {
    const namespace = LogBase.namespace(fileName)

    const log = (...args: [arg: any, ...args: any[]]) => {
        const debug = Debug(namespace)

        // by default debug will log to stderr.
        // so we need to bind it back to console.log
        debug.log = console.log.bind(console)
        return debug(...args)
    }

    const logError = (...args: [arg: any, ...args: any[]]) => {
        const debug = Debug(namespace)

        // force debug to be enabled despite namespacing
        if (process.env.LOG_ERROR === 'true') debug.enabled = true
        return debug(...args)
    }

    const logFatal = (...args: [arg: any, ...args: any[]]) => {
        return console.error('\x1b[31m', 'FATAL:', namespace, ...args)
    }

    return { log, logError, logFatal }
}

export default Log
export { Log, LogBase }
