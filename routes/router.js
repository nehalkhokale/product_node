const express = require('express')
const router = new express.Router()
const constants = require('../constants/constants')
const User= require('../controllers/User')
const UserCollection = require('../models/User')
const Rent = require('../controllers/Rent')
const multer = require('multer')
var fs = require('fs');

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//       // cb(null, file.fieldname + '-' + Date.now() + '.jpg')
//       cb(null, file.fieldname + '-' + Date.now() + '.jpg')

//     }
//   })
//   const imageFilter = (req,file,cb)=>{
//     if(!file.originalname.match(/\.(jpg|jpeg|png|PNG)$/)){
//       return  cb(new Error('You can only upload image files!'),false)
//     }
//     cb(null,true)
//   }
//   var upload = multer({ storage: storage ,fileFilter: imageFilter}).single('userImage')

  
// check default route
router.get('/', (req, res) => {
    res.json({
        message: constants.WELCOME_MSG,
    })
})

// router.post('/image',upload.single('userImage'),(req,res,next)=>{
//      console.log('--req',req.file);
//     //  res.json({message:'done'})
     
// })
//Users 
router.post('/user/register', User.register)
router.post('/user/login', User.login)
 
//Protected routes 
router.use(User.verifyToken)

router.post('/image', function (req, res) {
  console.log('-- req.session.userInfo.firstName', req.session.userInfo.name.firstName);
  let name = req.session.userInfo.name.firstName +req.session.userInfo.name.lastName+req.session.userInfo._id 
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      // cb(null, file.fieldname + '-' + Date.now() + '.jpg')
      cb(null, name+ '.jpg')
  
    }
  })
  const imageFilter = (req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|PNG)$/)){
      return  cb(new Error('You can only upload image files!'),false)
    }
    cb(null,true)
  }
  var upload = multer({ storage: storage ,fileFilter: imageFilter}).single('userImage')
  // req.file.filename = req.session.userInfo.firstName +req.session.userInfo.lastName
  upload(req, res, function (err) {
    if (err ) {
        console.log('--err',err);
      res.json({error :true,success:false  ,message:err.message})
      // A Multer error occurred when uploading.
    } else{
      console.log('--req.file',req.file,req.session);
      let _id = req.session.userInfo._id
      console.log('--_id',_id);
      let user = {
        image:req.file.path
      }
      UserCollection.findByIdAndUpdate(_id, user, { new: true }, function (err, userUpdate) {
        if (err) { return handleError(err, req, res, next) }
        else {
            // res.json({ success: true, error: false, message: 'users updated', data: userUpdate })
        }

    })
      res.json({error :false,success:true  ,message:'image upload', data:req.file})
    }
    // Everything went fine.
  })

})
router.get('/v1/auth/me', User.me)
router.get('/getFile',function(req,res){

//   fs.readFile(req.session.userInfo.image, function(err, data) {
//     res.writeHead(200,{'Content-type':'image/jpg'});
//     // res.end(content);
//   // res.write(data);
//   res.end();
// })
// var query = url.parse(req.url,true).query;
// var pic = query.image;

//read the image using fs and send the image content back in the response
fs.readFile(req.session.userInfo.image , function (err, content) {
if (err) {
    res.writeHead(400, {'Content-type':'text/html'})
    console.log(err);
    res.end("No such image");    
} else {
    //specify the content type in the response will be an image
    res.writeHead(200,{'Content-type':'image/jpg'});
    res.end(content);
}
});
})
router.post('/user/changepassword', User.changePassword)
router.post('/createuser', User.create)
router.put('/updateuser/:id', User.update)
router.get('/userbyid/:id',User.getOne)
router.get('/userlist', User.checkAdmin ,User.getAllUser)
router.put('/deleteuser/:id', User.notAciveUser)
router.delete('/user/:id', User.deleteUser)


//Rent 
router.post('/rent', Rent.create)
router.get('/rent/:id', Rent.getOne)
router.get('/rentlist', Rent.getAll)
router.put('/rent/:id', Rent.update)
router.put('/deleterent/:id', Rent.notAvailable)
router.delete('/rent/:id', Rent.delete)


module.exports = router
