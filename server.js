const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const api = require('./src/data')



app.use(express.static(path.join(__dirname, 'src')))
app.use(express.static(path.join(__dirname, 'node_modules')))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    next()
})

// checking that NIS & EUR is set properly
app.post('/rates', function (req, res) {
    const data = req.body
    for (let rates of api.allData) {
        if (data.rate == rates.rate && data.currency === rates.currency) {
            res.send('Ok')
        }
    }
})

app.get('/convert/:number/:firtsCurrency/:secondCurrency',
    function (req, res) {
        
        // setting variebles as the url parmmaters
        let number = req.params.number
        let firtsCurrency = req.params.firtsCurrency.toUpperCase()
        let secondCurrency = req.params.secondCurrency.toUpperCase()
        
        for (let apiData of api.allData) {
            if (firtsCurrency === apiData.currency) {
                firtsCurrency = apiData.rate
            }
            if (secondCurrency === apiData.currency) {
                secondCurrency = apiData.rate
            }
        }

        // calculating the new rate
        let convertedMoney = secondCurrency / firtsCurrency * number

        // setting the converted money to have only two numbers after the dot
        convertedMoney = convertedMoney.toFixed(2);

        res.send(`${convertedMoney}`)
    })

app.listen(process.env.PORT || 8080, function () {
    console.log(`Server is running!`)
})






