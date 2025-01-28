import 'dotenv/config'
import express from 'express'
import logger from "./logger.js";
import morgan from "morgan";



const app = express()
const port = process.env.PORT ||4000

// app.get("/", (req, res) =>{
//     res.send("Hello Bikers!")
// })

// app.get("/royal-enfield", (req, res) =>{
//     res.send("Classic ,Meteor,Hunter!")
// })

// app.get("/triumph", (req, res) =>{
//     res.send("speed400,scrambler400x")
// })

app.use(express.json())

const morganFormat = ":method :url :status :response-time ms";
app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          const logObject = {
            method: message.split(" ")[0],
            url: message.split(" ")[1],
            status: message.split(" ")[2],
            responseTime: message.split(" ")[3],
          };
          logger.info(JSON.stringify(logObject));
        },
      },
    })
  );

let bikeData = []
let nextId = 1

// Add new Bike
app.post('/bikes', (req, res) => {
    logger.warn("Post Request was made to new bike")
    const { name, price } = req.body
    const newBike = {id: nextId++, name, price}
    bikeData.push(newBike)
    res.status(201).send(newBike)
})

// Rpute to get all bikes

app.get('/bikes', (req,res)=>{
    res.status(200).send(bikeData)
})

// Get a particular bike with id 

app.get('/bikes/:id',(req, res) => {
   const moto =  bikeData.find(bike => bike.id === parseInt(req.params.id))
   if(!moto){
    return res.status(404).send("Bike Not Found")
   }
   res.status(200).send(moto)
})

// update bikes

app.put('/bikes/:id',(req, res) => {
    const moto =  bikeData.find(bike => bike.id === parseInt(req.params.id)) 
    if(!moto){
        return res.status(404).send("Bike Not Found")
    }
    const {name, price} = req.body
    moto.name = name
    moto.price = price
    res.send(200).send(moto)
})

// delete bike
app.delete('/bikes/:id', (req, res) => {
    const index = bikeData.findIndex(b => b.id === parseInt(req.params.id))
    if(index === -1){
        return res.status(404).send('Bike Not Found!')
    }
    bikeData.splice(index, 1)
    res.status(204).send('deleted!')
})


app.listen(port, () => {
console.log(`Server is Running at ${port}`)
}
)