const Customer = require('../models/Customer')


function customerNew(req, res) {
    res.render('customer/new')
}

function customerList(req, res) {
    Customer.find().lean().exec(function (err, customers) {
        if (err) {
            res.send(err)
        } else {
            res.render('customer/list', {
                customers,
                helpers: {
                    inc: function (value) {
                        return parseInt(value) + 1
                    }
                }
            })
        }
    })
}

function customerAdd(req, res) {
    const customerId = req.params.id
    const newCustomer = new Customer({ customers: customerId, ...req.body })

    newCustomer.save(function (err) {
        if (err)
            return handleError(err)
    })

    res.redirect('/customer/list')
}

function customerDelete(req, res, cb) {
    const customerId = req.params.id
    Customer.deleteOne({ _id: customerId }, function (err) {
        if (err) {
            cb(err)
        }
    })

    res.redirect('/customer/list')
}

function customerShow(req, res, cb) {
    const customerId = req.params.id
    Customer.findOne({ _id: customerId }, function (err, customer) {
        if (err) {
            cb(err)
        }
        else {
            customer.populate('events')
        }

        res.render('customer/show', {
            customerId: customer._id,
            name: customer.name,
            address: customer.address,
            company: customer.company,
            nipnumber: customer.nipnumber,
            events: customer.events
        })
    })
}


module.exports = {
    customerNew,
    customerList,
    customerAdd,
    customerDelete,
    customerShow
}