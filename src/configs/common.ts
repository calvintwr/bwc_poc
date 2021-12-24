import { join } from 'path'
const config = {
    routeMagic: {
        invokerPath: join(__dirname, '../'),
        logMapping: process.env.NODE_ENV === 'production' ? false : true,
        ignoreSuffix: 'bak'
    },
}
Object.freeze(config)
export default config
