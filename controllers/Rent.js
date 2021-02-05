const Rent = require('../models/Rent')

//add available places
module.exports.create = function(req,res,next){
    let rent = req.body
    let _userInfo = req.session.userInfo
    let ownerName = {
        _id: _userInfo._id,
        email: _userInfo.email ? _userInfo.email : null,
        name: _userInfo.name ? _userInfo.name : null,
        org: _userInfo.org ? _userInfo.org : null,
        mobile: _userInfo.mobile ? _userInfo.mobile : null,
    }
    rent.ownerName = ownerName
    Rent.create(rent,function(err,rentDoc){
        if (err) return handleError(err,req,res,next)
        else
        res.json({success: true, error: false, message: 'created',data: rentDoc})
    })
}
//get one place
module.exports.getOne = function (req,res,next){
    let _id = req.params.id
    Rent.findById(_id, function(err,displayRole){
        if (err) return handleError(err,req,res,next)
        else
        res.json({success: true, error: false, message:'category '+ _id +'  updated', data:displayRole})

    })
}
//update the rental place details based on where the place is rented already
module.exports.update = function (req,res,next){
    let _id = req.params.id
    let role = req.body
    Rent.update({ '_id': _id ,'isRented':false}, { $set:role}, {new: true }, function(err,Update){
        if (err) return handleError(err,req,res,next)
        else if(Update && Update.nModified===0){
            res.json({success: false, error: true, message: 'Place :'+ _id+' is not updated', data: Update})
        }else{
            res.json({success: true, error: false, message:'updated', data:Update})
        }
    })
}
//list all places available for rent
module.exports.getAll= function(req,res,next){
    let _filter = req.query.filter
    let allRole = {}

    if (_filter) {
        allRole = JSON.parse(_filter)
    }    
    Rent.find({ 'isActive': true }).exec( function(err, allRentDoc) {
        if (err) return handleError(err, req, res, next)
       
        res.json({error: false, success: true, message: '', data: allRentDoc})
    })

}
//delete the place available for rent based on where the place is rented already
module.exports.notAvailable=function(req,res,next){
    let _id = req.params.id
    let remarks = req.body.remarks

    Rent.update({ '_id': _id ,'isRented':false}, { $set: { 'isActive':false, 'remarks': remarks }},
        {new : true},  (err, deletedDoc)=> {
        if (err) return handleError(err,res,req,next)
        else if(deletedDoc && deletedDoc.nModified===0){
            res.json({success: false, error: true, message: 'Place :'+ _id+' is not deleted', data: deletedDoc})
        }else{
            res.json({success: true, error: false, message: 'Place :'+ _id+' is deleted', data: deletedDoc})
        }
    })



}
//delete the place available for rent
module.exports.delete=function(req,res,next){
    let _id = req.params.id
    Rent.deleteOne({ '_id': _id ,'isRented':false}, function(err,deletedDoc){
        if (err) return handleError(err,res,req,next)
        else
        res.json({success: true, error: false, message: 'Place '+ _id+' is deleted', data: deletedDoc})
    })
}