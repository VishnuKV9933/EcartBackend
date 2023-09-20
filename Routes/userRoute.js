const router=require('express').Router()


const {Register,Login,verifyUser,products}= require('../Controller/UserController')

router.post('/register',Register)

router.post('/login',Login)

router.get('/product/:page',verifyUser,products)


module.exports = router 
