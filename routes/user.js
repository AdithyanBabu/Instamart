var express = require('express');
var router = express.Router();
var productHelp = require('../help/product_help')
var cartHelp = require('../help/cart_help')
const userHelp = require('../help/signup_help')

/* GET home page. */
router.get('/', (req, res) => {
  res.render('user/welcome', {customer:req.session.customer})
})

router.get('/products', function (req, res, next) {
  productHelp.getAllProducts().then((products) => {
    res.render('user/view-products', { user: true, products, customer:req.session.customer})
  })
});

router.get('/cart', async (req, res) => {
  if (req.session.userloggedIn) {
    let total = await cartHelp.getTotal()
    cartHelp.getCartItems().then((Items) => {
      res.render('user/cart', { user: true, Items, total, customer:req.session.customer})
    })
  }
  else {
    res.redirect('/login')
  }
})

router.get('/signup', function (req, res, next) {
  res.render('user/signup',{signerr:req.session.signupErr})
})

router.post('/signup', (req, res) => {
  userHelp.doSignup(req.body).then((response) => {
    if (response.status)
    res.redirect('/login')
    else
    {
      req.session.signupErr=true
      res.redirect('/signup')
    }
  })
})

router.get('/login', function (req, res, next) {
  res.render('user/login',{logerr:req.session.loginUserErr})
})

router.post('/login', (req, res) => {

  userHelp.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.userloggedIn = true
      req.session.customer = response.customer
      res.redirect('/products')
    }
    else {
      req.session.loginUserErr = true
      res.redirect('/login')
    }
  })
})

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/products')
})


router.get('/add-to-cart/:id', (req, res) => {
  if (req.session.userloggedIn)
  {
    let itemid = req.params.id
  cartHelp.addToCart(itemid)
  res.redirect('/products')
  }
  else
  res.redirect('/login')
})

router.get('/products/delete/:ID', (req, res) => {
  let itemid = req.params.ID
  cartHelp.deleteitem(itemid).then((response) => {
    console.log(response)
    res.redirect("/cart")
  })
})

router.get('/products/increment/:ID', (req, res) => {
  let itemid = req.params.ID
  cartHelp.incrementitem(itemid).then((response) => {
    console.log(response)
    res.redirect("/cart")
  })
})

router.get('/products/decrement/:ID', (req, res) => {
  let itemid = req.params.ID
  cartHelp.decrementitem(itemid).then((response) => {
    console.log(response)
    res.redirect("/cart")
  })
})

router.get('/checkout', async (req, res) => {
  let total = await cartHelp.getTotal()
  cartHelp.getCartItems().then((Items) => {
    res.render('user/summary', { user: true, Items, total, customer:req.session.customer})
  })
})

router.get('/payment', async (req, res) => {
  let total = await cartHelp.getTotal()
  res.render('user/payment', { user: true, total, customer:req.session.customer })
});

module.exports = router;
