import { Router } from "express"
import { postLogin } from "../controllers/Login.js"

const RouterLogin = Router()

RouterLogin.post('/login', postLogin)

export default RouterLogin
