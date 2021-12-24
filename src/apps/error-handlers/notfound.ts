import { NextFunction, Request, Response } from "express"
import Log from "../logger"

const { log } = Log(__filename)

const errorNotFound = (req: Request, res: Response, next: NextFunction) => {
    log('Not found.')
    const err       = new Error('404: Not Found')
    res.statusCode  = 404
    next(err)
}

export default errorNotFound
export { errorNotFound }
