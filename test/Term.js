//  During the test the env variable is set to test
process.env.NODE_ENV = 'test'

//  Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../app')
let should = chai.should()

chai.use(chaiHttp)

let data = {
    auction: 0,
    item: 0,
    lot: 0,
    round: 1,
    quantity: 50,
}

describe('Term', () => {
    /*
     * Test the /POST route
     */
    describe('/POST Term', () => {
        it('it should POST a request', (done) => {
            chai.request(server)
                .post('/pnc/contract/api/v1/term')
                .send(data)
                .end((err, res) => {
                    if (err) throw err
                    if (should) console.log(should)
                    res.should.have.status(403)
                    done()
                })
        })
    })
})
