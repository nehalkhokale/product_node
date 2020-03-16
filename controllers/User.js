const User = require('../models/User')
const bcrypt = require('bcryptjs')
const constants = require('../constants/constants')
const jwt = require('jsonwebtoken')
const Token = require('../models/Token')
const config = require('../config/config')
const assert = require('assert')

handleError = function (err, req, res, next) {
    res.status(500).send({ success: false, error: true, message: `${err.message}` })
}
handle401Error = (err, req, res, next) => {
    res.status(constants.HTTP_401).json({ 'error': true, 'success': false, 'message': err.message })
}
handle403Error = (err, req, res, next) => {
    res.status(constants.HTTP_401).json({ 'error': true, 'success': false, 'message': err.message })
}
module.exports.register = (req, res, next) => {
    let hashedPassword = bcrypt.hashSync(req.body.password, 8)
    let _User = req.body
    _User.hash = hashedPassword
    // console.log('---_User',_User);
    // const span = tracer.startSpan('registerUser')
    User.create(_User, (err, doc) => {
        // span.log({'data': doc})
        // span.finish()
        // console.log('doc',doc);

        if (err) return handleError(err, req, res, next)
        res.status(constants.HTTP_200).json({
            message: constants.USER_CREATED,
            data: doc,
        })
    })
}
exports.login = (req, res, next) => {

    User.findOne({
        'email': req.body.email
    }, (err, data) => {
        // console.log('data',data , req.session);

        if (err) {
            return res.json({
                message: 'Error'
            })
        }
        if (data != null) {
            let passwordIsValid = bcrypt.compareSync(req.body.password, data.hash)
            // let books_pw = crypto.createHash('md5').update(req.body.books_pw).digest('hex')
            if (passwordIsValid) {
                let buff = new Buffer(config.token.secret)
                let base64data = buff.toString('base64')
                let token = jwt.sign({ id: data.email }, base64data, {
                    // expiresIn: '24h'
                    expiresIn: config.token.validity, // expires in 24 hours
                }
                )
                try {
                    req.session.login(req, data, (err) => {
                        if (err) return handleError(err, req, res, next)
                    })
                } catch (error) {
                    return handleError(error, req, res, next)
                }

                req.session.token = token
                let userDetail = JSON.parse(JSON.stringify(data))
                userDetail.token ='Bearer ' + token
                delete userDetail.hash
                res.json({
                    success: true,
                    message: 'Authentication successful!',
                    data:userDetail ,
                    // token: 'Bearer ' + token
                });
                let createdAt = Date.now()
                Token.update({ email: req.body.email }, { token: token, createdAt: createdAt }, { upsert: true, setDefaultsOnInsert: true }, (err, doc) => {
                    // console.log(' in token doc',doc);

                })
            } else {
                // req.session.token = token
                // console.log('--------after',req.session);

                return res.json({
                    error: true,
                    success: false,
                    message: 'Please check whether you have entered valid password ',
                    data: []
                })
            }
        }
        else {
            res.json({
                error: true,
                success: false,
                message: 'Please check whether you have entered valid email',
                data: []
            });
        }
    })
}
module.exports.changePassword = (req, res, next) => {
    let request = req.body
    let id = req.body._id
    req.body.email = req.session.userInfo.email
    console.log('--req.body.email ',req.body.email );
    
    User.findOne({
        'email': req.body.email
    }, (err, data) => {
        console.log('data', data);

        if (err) {
            return res.json({
                error: false,
                success: true,
                message: err.message,
                data: []
            })
        }
        if (data != null) {
            let passwordIsValid = bcrypt.compareSync(req.body.password, data.hash)
            // let books_pw = crypto.createHash('md5').update(req.body.books_pw).digest('hex')
            if (passwordIsValid) {
                let hashedPassword = bcrypt.hashSync(req.body.newpassword, 8)
                let _User = req.body
                _User.hash = hashedPassword
                User.findOneAndUpdate({ 'email': req.body.email }, { $set: { 'hash': _User.hash } }, { new: true }, (err, newPassword) => {
                    if (err) return handleError(err, req, res, next)
                    else
                        res.json({ success: true, error: false, message: 'Password is updated', data: newPassword })
                })

            } else {
                return res.json({
                    error: true,
                    success: false,
                    message: 'Please check whether you have entered valid password ',
                    data: []
                })
            }
        }
        else {
            res.json({
                error: true,
                success: false,
                message: 'Please check whether you have entered valid email',
                data: []
            });
        }
    })
}

module.exports.verifyToken = (req, res, next) => {
    //  get the token from the request
    let Bearer = null
    if (req.headers['authorization']) Bearer = req.headers['authorization'].split(' ')[1]
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || Bearer
    //  if token exists, verify the same
    //  console.log(token)
    // also verify token from session data
    // console.log('--token',token)
    let user = null
    if (token) {
        let buff = new Buffer(config.token.secret)
        let base64data = buff.toString('base64')
        // console.log('====base64data',base64data,buff);

        jwt.verify(token, base64data, function (err, decoded) {
            if (err) {
                // console.log('----err', err)
                return handle401Error({ 'message': constants.INVALID_SESSION }, req, res, next)
            }
            // console.log('----decoded',decoded);
            // console.log('--req.session', req.session);


            req.decoded = decoded
            user = decoded.id
            req.isAuthenticated = true
            //  res.status(constants.HTTP_200).json({'error': false, 'message': constants.VALID_TOKEN})
        })
        //  let dbToken = null
        let q = { email: user }
        console.log('q', q)
        let willGetAUser = User.findOne(q).exec()
        assert.ok(willGetAUser instanceof Promise)
        willGetAUser
            .then((doc) => {
                // console.log(doc)
                req.session.userInfo = doc
                // req.session.user = req.session.userInfo.email
                let willGetAToken = Token.findOne(q).exec()
                assert.ok(willGetAToken instanceof Promise)
                willGetAToken
                    .then((doc) => {
                        //  dbToken = doc.token
                        // console.log(doc, "Doc")
                        if (!doc) return handle401Error({ 'message': constants.INVALID_SESSION }, req, res, next)
                        if (doc.token !== token) return handle401Error({ 'message': constants.INVALID_SESSION }, req, res, next)
                        //send session
                        let resData = req.session
                        next()
                        // res.json({error: false, success: true, message: '', data: resData})
                    }).catch((err) => {
                        console.log(err)
                        return handle401Error({ 'message': constants.INVALID_SESSION }, req, res, next)
                    })
            }).catch((err) => {
                console.log(err)
                return handle401Error({ 'message': constants.INVALID_SESSION }, req, res, next)
            })
    } else {
        return handle401Error({ 'message': constants.INVALID_SESSION }, req, res, next)
    }
}

module.exports.me = (req, res, next) => {
    
    let Bearer = null
    if (req.headers['authorization']) Bearer = req.headers['authorization'].split(' ')[1]
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || Bearer

    // console.log('--00 req.session', req.session.user,req.session)
    let _email = null
    if(req.session.userInfo.email) {
        // req.session.user = req.session.userInfo.email
        _email = req.session.userInfo.email.toLowerCase()
    } else {
        return handle403Error({ 'message': constants.INVALID_SESSION }, req, res, next)
    }
    // console.log('==-11 req.session again', req.session)
    // console.log('--- 1_email', _email)
    let dbToken = null
    let willGetAToken = Token.findOne({ email: _email }).exec()
    assert.ok(willGetAToken instanceof Promise)
    willGetAToken.then((doc) => {
        // console.log('--1 doc', doc)
        dbToken = doc.token
        if ((null === dbToken) || (!dbToken === token)) return handle403Error({ 'message': constants.INVALID_TOKEN }, req, res, next)
        let resData = req.session
        // user info here
        // console.log(resData)
        // console.log(_email)
        // console.log('1 --token', token)
        // console.log('1-- dbToken', dbToken)
        if(dbToken === token){

            res.json({ error: false, success: true, message:'valid token', data: [] })
        } else {
            res.json({ error: true, success: false, message:'invalid token', data: [] })
        }
        // User.findOne({ 'email': _email }).exec()
        //     .then((doc) => {
        //         console.log(_email, doc)
        //         resData.userInfo = doc
        //         res.json({ error: false, success: true, message: `namaste ${doc.email}`, data: resData })
        //     })
        //     .catch((err) => handleError(err, req, res, next))
    }).catch((err) => {
        return handle403Error({ 'message': constants.INVALID_TOKEN }, req, res, next)
    })
}

module.exports.create = function (req, res, next) {
    let user = req.body
    User.create(user, function (err, userDoc) {
        if (err) return handleError(err, req, res, next)
        else
            res.json({ success: true, error: false, message: 'user created', data: userDoc })
    })
}
module.exports.update = function (req, res, next) {
    let _id = req.params.id
    let user = req.body
    // console.log('here');

    let email = /\S+@\S+\.\S+/
    User.findByIdAndUpdate(_id, user, { new: true }, function (err, userUpdate) {
        if (err) { return handleError(err, req, res, next) }

        else if (!user.email.match(email)) {
            err = 'Invalid  email'
            res.json({ success: false, error: true, message: err, data: [] })

        }
        else {
            res.json({ success: true, error: false, message: 'users updated', data: userUpdate })
        }

    })
}
module.exports.getOne = function (req, res, next) {
    let _id = req.params.id
    User.findById(_id).exec(function (err, displayUser) {
        if (err) return handleError(err, req, res, next)
        else
            res.json({ success: true, error: false, message: 'user', data: displayUser })

    })
}
module.exports.getAllUser = function (req, res, next) {
    let _filter = req.query.filter
    let allUser = {}
console.log('req.session',req.session);

    if (_filter) {
        allUser = JSON.parse(_filter)
    }
    User.find({ 'isActive': true }).populate({ path: 'role' }).exec(function (err, allUserDoc) {
        console.log('err', err);
        //.populate( {path :'role'})
        if (err) return handleError(err, req, res, next)

        res.json({ error: false, success: true, message: '', data: allUserDoc })
    })

}

module.exports.notAciveUser = function (req, res, next) {
    let _id = req.params.id
    let remarks = req.body.remarks

    User.update({ '_id': _id }, { $set: { 'isActive': false, 'remarks': remarks } },
        { new: true }, (err, deletedDoc) => {
            if (err) return handleError(err, res, req, next)
            else
                res.json({ success: true, error: false, message: 'user is deleted', data: deletedDoc })
        })



}
module.exports.deleteUser = function (req, res, next) {
    let _id = req.params.id
    User.deleteOne({ _id }, function (err, deletedDoc) {
        if (err) return handleError(err, res, req, next)
        else
            res.json({ success: true, error: false, message: 'user ' + _id + ' is deleted', data: deletedDoc })
    })



}
