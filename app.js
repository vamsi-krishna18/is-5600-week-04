const fs = require('fs').promises
const path = require('path')
const express = require('express')
const api = require('./api')
const Products = require('./products')

// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()
// Register the public directory
app.use(express.static(__dirname + '/public'));
// register the routes
app.get('/products', listProducts)
app.get('/', handleRoot);
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)

app.get('/products/:id', api.getProduct)
// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 * @param {object} req
 * @param {object} res
 */
async function listProducts (req, res) {
  try {
    res.json(await Products.list()) // Use the Products service
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function listProducts(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  try {
    const data = await fs.readFile(productsFile)
    res.json(JSON.parse(data))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
// app.js
// Require the middleware module
const middleware = require('middleware')

// Register our upcoming middleware
app.use(middleware.cors)
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
// middleware.js
/**
 * Handle errors
 * @param {object} err
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
function handleError (err, req, res, next) {
  // Log the error to our server's console
  console.error(err)
  
  // If the response has already been sent, we can't send another response
  if (res.headersSent) {
    return next(err)
  }

  // Send a 500 error response
  res.status(500).json({ error: "Internal Error Occurred" })
}

/**
 * Send a 404 response if no route is found
 * @param {object} req
 * @param {object} res
 */
function notFound (req, res) {
  res.status(404).json({ error: "Not Found" })
}
// app.js
// Add body parser middleware
const bodyParser = require('body-parser')

// ...
app.use(middleware.cors)
app.use(bodyParser.json())

//...
app.post('/products', api.createProduct)
