const express = require("express")
const mongoose = require("mongoose")
const shortURL = require("./models/shortURL")
const app = express()

mongoose.connect("mongodb://localhost/urlshortner", {
    useNewUrlParser : true ,useUnifiedTopology: true
})

app.set("view engine", "ejs")
app.use(express.urlencoded({extended:false}))


app.get("/", async (req,res) => {
    const shortURLS = await shortURL.find()
    res.render("index", {shortURLS: shortURLS})
})

app.post("/shortURL", async (req,res) => {
    await shortURL.create({full: req.body.fullURL})
    
    res.redirect("/")
})

app.get('/:shortid', async (req, res) => {
	// grab the :shortid param
	const shortid = req.params.shortid

	// perform the mongoose call to find the long URL
	const rec = await ShortURL.findOne({ short: shortid })

	// if null, set status to 404 (res.sendStatus(404))
	if (!rec) return res.sendStatus(404)

	// if not null, increment the click count in database
	rec.clicks++
	await rec.save()

	// redirect the user to original link
	res.redirect(rec.full)
})


mongoose.connection.on('open', () => {
    app.listen(process.env.PUBLIC_PORT, () => {
        console.log('Server started')
    })
})
