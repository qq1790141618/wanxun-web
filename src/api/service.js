import * as user from "./userApi.js"
import * as userM from "./userMApi.js"
import * as userE from "./userEApi.js"
import * as userS from "./userSApi.js"
import * as app from "./appApi.js"
import * as analysis from "./analysisApi.js"
import * as goods from "./goodsApi.js"
import * as imports from "./importApi.js"
import { request } from "./request.js"
import host from "./host.js"

const api = {
    app,
    analysis,
    goods,
    imports,
    user,
    userM,
    userE,
    userS
}

const service = {
    host,
    api,
    request
}

export default service