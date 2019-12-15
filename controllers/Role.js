const Roles = require('../models/Role')

module.exports.create = function(req,res,next){
    let role = req.body
    Roles.create(role,function(err,roleDoc){
        if (err) return handleError(err,req,res,next)
        else
        res.json({success: true, error: false, message: 'role created',data: roleDoc})
    })
}
module.exports.getOne = function (req,res,next){
    let _id = req.params.id
    Roles.findById(_id, function(err,displayRole){
        if (err) return handleError(err,req,res,next)
        else
        res.json({success: true, error: false, message:'category '+ _id +'  updated', data:displayRole})

    })
}
module.exports.update = function (req,res,next){
    let _id = req.params.id
    let role = req.body
    Roles.findByIdAndUpdate(_id,role, {new: true }, function(err,roleUpdate){
        if (err) return handleError(err,req,res,next)
        else
        res.json({success: true, error: false, message:'role  updated', data:roleUpdate})

    })
}

module.exports.getAllUser= function(req,res,next){
    let _filter = req.query.filter
    let allRole = {}

    if (_filter) {
        allRole = JSON.parse(_filter)
    }    
    Roles.find({ 'isActive': true }).exec( function(err, allRolesDoc) {
        if (err) return handleError(err, req, res, next)
       
        res.json({error: false, success: true, message: '', data: allRolesDoc})
    })

}

module.exports.notAciveUser=function(req,res,next){
    let _id = req.params.id
    let remarks = req.body.remarks

    Roles.update({ '_id': _id }, { $set: { 'isActive':false, 'remarks': remarks }},
        {new : true},  (err, deletedDoc)=> {
        if (err) return handleError(err,res,req,next)
        else
        res.json({success: true, error: false, message: 'user '+ _id+' is deleted', data: deletedDoc})
    })



}
module.exports.deleteUser=function(req,res,next){
    let _id = req.params.id
    Roles.deleteOne({_id}, function(err,deletedDoc){
        if (err) return handleError(err,res,req,next)
        else
        res.json({success: true, error: false, message: 'user '+ _id+' is deleted', data: deletedDoc})
    })



}