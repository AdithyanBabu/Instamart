const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelp=require('../help/product_help')
const userHelp=require('../help/signup_help')

/* GET users listing. */

router.get('/', function(req, res, next) {
    productHelp.getAllProducts().then((products)=>{
      res.render('admin/view_products',{admin:true,products})
    })
});

router.get('/add-product',function(req,res){
    productHelp.getAllProducts().then((products)=>{
      res.render('admin/add-product',{admin:true})
    })
  })

router.post('/add-product',(req,res)=>{
  console.log(req.body)
  console.log(req.files.Image);

  productHelp.addProduct(req.body,(id)=>
  {
    let image=req.files.Image
    image.mv('./public/images/'+id+'.jpeg'),(err,done)=>{
    }
    res.redirect("/admin") 
  })
})


router.get('/products/edit',(req,res)=>{

})

router.get('/products/delete/:ID',(req,res)=>{
  let itemid=req.params.ID
  console.log(itemid)
  productHelp.deleteitem(itemid).then((response)=>{
    console.log(response)
    res.redirect("/admin")
  })
})

router.get('/products/edit/:ID',async(req,res)=>{
  let itemid=req.params.ID
  console.log(itemid)
  let product=await productHelp.getdetails(itemid)
  console.log(product)
  res.render('admin/edit-product',{admin:true,product})
})

router.post('/products/edit/:ID',(req,res)=>{
  let itemid=req.params.ID
  productHelp.updateitem(req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let image=req.files.Image
      image.mv('./public/images/'+itemid+'.jpeg')
    }
  })
})
module.exports = router;
