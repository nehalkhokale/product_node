module.exports.handleError = function(err, req, res, next) {
    res.status(err.code || 500).send({success: false, error: true, message: `${err.message}`})
}
