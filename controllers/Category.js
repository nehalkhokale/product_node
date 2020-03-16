const Category = require('../models/Category')

handleError = function (err, req, res, next) {
    res.status(500).send({ success: false, error: true, message: `${err.message}` })
}
module.exports.createCategory = function (req, res, next) {
    let category = req.body
    Category.create(category, function (err, categoryDoc) {
        if (err) return handleError(err, req, res, next)
        else
            res.json({ success: true, error: false, message: 'category created', data: categoryDoc })
    })
}
// module.exports.getOne = function (req,res,next){
//     let _id = req.params.id
//     Category.findById(_id, function(err,displayCat){
//         if (err) return handleError(err,req,res,next)
//         else
//         res.json({success: true, error: false, message:'category '+ _id +'  updated', data:displayCat})

//     })
// }
module.exports.getOne = function (req, res, next) {
    let _id = req.params.id
    Category.findOne({ '_id': _id, 'isActive': true }, function (err, categoryByIdDoc) {
        if (err) return handleError(err, req, res, next)
        let activeCat = []
        let isActiveSubCat = []
        categoryByIdDoc.subCategory.forEach((subCat, indexSub) => {
            // let isActivSubCat = []
            if (subCat.isActive) {
                isActiveSubCat = isActiveSubCat.concat(subCat)
            }
        })
        let obj = {
            _id: categoryByIdDoc._id,
            category: categoryByIdDoc.category,
            subCategory: isActiveSubCat,
            createdAt: categoryByIdDoc.createdAt,
            updatedAt: categoryByIdDoc.updatedAt,
            isActive: categoryByIdDoc.isActive
        }
        activeCat = activeCat.concat(obj)

        // console.log('activeCat', activeCat);

        res.json({ error: false, success: true, message: '', data: activeCat[0] })
    })

}
module.exports.updateCategory = function (req, res, next) {
    let _id = req.params.id
    let category = req.body
    Category.findOne({ '_id': _id }).exec((err, subCategoryUpdateDoc) => {
        var differences = diff(subCategoryUpdateDoc, category); 
        // console.log('--differences' , differences);
        
    Category.findByIdAndUpdate(_id, category, { new: true }, function (err, categoryUpdate) {
        if (err) return handleError(err, req, res, next)
        else
            res.json({ success: true, error: false, message: 'category  updated', data: categoryUpdate })

    })
})
}
module.exports.subCategoryUpdate = function (req, res, next) {
    let _id = req.params.id
    let subCategoryReq = req.body
    Category.findOne({ '_id': _id }).exec((err, subCategoryUpdateDoc) => {
        // console.log('subCategoryUpdateDoc', subCategoryUpdateDoc, subCategoryReq);
        if (err) return handleError(err, req, res, next)
        let newSubCat = []
        let oldSub = []
        let idArray = []
        newSubCat = subCategoryReq.subCategory.filter((element) => !element._id)
        // console.log('newSubCat', newSubCat);
        oldSub = subCategoryReq.subCategory.filter((element) => element._id)
        // console.log('oldSub', oldSub);
        let test = []
        oldSub.forEach((ele, index) => {
            idArray = idArray.concat(ele._id)
        });
        test = subCategoryUpdateDoc.subCategory.filter((f) => !idArray.includes(f._id.toString()));
        // console.log('test', test);
        // console.log('old', idArray);
        subCategoryUpdateDoc.subCategory.forEach((element, index) => {

            let flag = test.some(el => el._id === element._id)
            if (flag) {
                // console.log('index', index, element._id);
                Category.findOneAndUpdate(
                    {
                        '_id': _id,
                        'subCategory._id': element._id,

                    },

                    {
                        $set: {
                            [`subCategory.${index}.isActive`]: false,
                        },
                    }, { new: true },
                    (err, doc) => {
                        // console.log('doc', doc);

                    })
            }
            if (index === subCategoryUpdateDoc.subCategory.length - 1) {
                Category.findOneAndUpdate(
                    {
                        '_id': _id,
                    },

                    {
                        $push: {
                            'subCategory': newSubCat
                        },
                    }, { new: true },
                    (err, newSubCatDoc) => {
                        // console.log('newSubCatDoc', newSubCatDoc);
                        res.json({ success: true, error: false, message: 'category is updated', data: newSubCatDoc })


                    }

                )
            }

        })
        //,set:{{'subCategory':{'_id':{$in:idArray}}}}
        //{$and:[{$nin:idArray},{'isActive':false}]}
        // Category.findOneAndUpdate({ '_id': _id ,'subCategory':{'_id':{$nin:idArray}}},{$set:{'subCategory':{'_id':{'isActive':false}}}}).exec(function(err,doc ){
        //     console.log('doc',doc,err);
        // })

    })

}

// module.exports.getAllCategory= function(req,res,next){
//     let _filter = req.query.filter
//     let allCategory = {}

//     if (_filter) {
//         allCategory = JSON.parse(_filter)
//     }    
//     Category.find(allCategory).exec( function(err, allcategoryDoc) {
//         if (err) return handleError(err, req, res, next)

//         res.json({error: false, success: true, message: '', data: allcategoryDoc})
//     })

// }
module.exports.getAllCategory = function (req, res, next) {
    let _filter = req.query.filter
    let allCategory = {}

    if (_filter) {
        allCategory = JSON.parse(_filter)
    }
    allCategory = {
        // $and:
        // [

        'subCategory.isActive': true
        // 'subCategory':{'isActive': true}

        // {
        //     'isActive':true
        //     },
        // ]
    }
    Category.find({ 'isActive': true }).exec(function (err, allcategoryDoc) {
        if (err) return handleError(err, req, res, next)
        let activeCat = []
        allcategoryDoc.forEach((category, index) => {
            // console.log('category', category);
            let isActiveSubCat = []
            category.subCategory.forEach((subCat, indexSub) => {
                // let isActivSubCat = []
                if (subCat.isActive) {
                    isActiveSubCat = isActiveSubCat.concat(subCat)
                }
            })
            let obj = {
                _id: category._id,
                category: category.category,
                subCategory: isActiveSubCat,
                createdAt: category.createdAt,
                updatedAt: category.updatedAt,
                isActive: category.isActive
            }

            // let obj = category;
            // obj.subCategory = isActiveSubCat;

            activeCat = activeCat.concat(obj)
        })
        // console.log('activeCat', activeCat);

        res.json({ error: false, success: true, message: '', data: activeCat })
    })

}
module.exports.notAciveCategory = function (req, res, next) {
    let _id = req.params.id
    let remarks = req.body.remarks
    
    // console.log('here',remarks);
    // console.log('----_id', _id);

    Category.update({ '_id': _id }, { $set: { 'isActive':false, 'remarks': remarks }},
        {new : true},  (err, deletedDoc)=> {
        console.log('err', err);
        // console.log('deletedDoc', deletedDoc);
        
        if (err) return handleError(err, res, req, next)
        else
            res.json({ success: true, error: false, message: 'categoryis deleted', data: deletedDoc })
    })

}

module.exports.deleteCategory = function (req, res, next) {
    let _id = req.params.id
    Category.deleteOne({ _id }, function (err, deletedcategoryDoc) {
        if (err) return handleError(err, res, req, next)
        else
            res.json({ success: true, error: false, message: 'user ' + _id + ' is deleted', data: deletedcategoryDoc })
    })



}
