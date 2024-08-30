let express = require('express');
let app = express();
let expressSession = require('express-session');
let bodyParser = require('body-parser');
let db = require("./database.js");
const {ObjectId} = require('mongodb');
app.use(expressSession({secret:"test123!@#",resave:true,saveUninitialized:true}));
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine','ejs');

app.get("/",function(req,res){
	let msg="";
	if(req.session.msg!=undefined && req.session.msg!="")
		msg = req.session.msg;
	res.render("home");
});

app.post('/signup', (req, res) => {
	res.render('signup');  
  });

app.post("/signupsubmit",async function(req,res){
	const user = db.collection("User");
	const result = await user.insertOne({firstname:req.body.firstname,lastname:req.body.lastname,email:req.body.email,password:req.body.password,phone:req.body.phone,gender:req.body.gender});
	if(result.acknowledged===true)
	{
		req.session.msg="Thank you for signing Up";
		res.render("Main",{msg:req.session.msg});
		req.session.msg = ""; 
	}
})

app.get("/alltracks", async function(req,res){
	const tracks = db.collection("Track");
	const tracklist=await tracks.find().toArray();
	res.render("listtracks_view",{tracklist:tracklist});
})

app.get("/addtrack",function(req,res){
	res.render("addtrack_view");
});

app.post("/addtracksubmit",async function(req,res){
	const track=db.collection("Track");
	const result = await track.insertOne({trackname: req.body.trackname,
		track_release_date: req.body.track_release_date,
		language: req.body.language,
		genre: req.body.genre});
	if(result.acknowledged===true)
	{
		req.session.msg=" Track added";
		res.render("Main",{msg:req.session.msg});
	}
	else
	{
		req.session.msg="can not add category";
		res.render("Main",{msg:req.session.msg});
	}
	req.session.msg = ""; 
});

app.get("/addplaylist",function(req,res){
	res.render("addplaylist_view");
});

app.post("/addplaylistsubmit",async function(req,res){
	const track=db.collection("Playlist");
	const result = await track.insertOne({title: req.body.title});
	if(result.acknowledged===true)
	{
		req.session.msg=" Playlist added";
		res.render("Main",{msg:req.session.msg});
	}
	else
	{
		req.session.msg="can not add Playlist";
		res.render("Main",{msg:req.session.msg});
	}
	req.session.msg = ""; 
});
app.get("/allplaylists", async function(req,res){
	const playlists = db.collection("Playlist");
	const playlist=await playlists.find().toArray();
	res.render("playlist_view",{playlist:playlist});
});
app.get("/addalbum",function(req,res){
	res.render("addalbum_view");
});

app.post("/addalbumsubmit",async function(req,res){
	const albums=db.collection("Albums");
	const result = await albums.insertOne({album_title: req.body.album_title});
	if(result.acknowledged===true)
	{
		req.session.msg=" Album added";
		res.render("Main",{msg:req.session.msg});
	}
	else
	{
		req.session.msg="can not add Album";
		res.render("Main",{msg:req.session.msg});
	}
	req.session.msg = ""; 
});
app.get("/allalbums", async function(req,res){
	const albums = db.collection("Albums");
	const album=await albums.find().toArray();
	res.render("allalbums_view",{album:album});
});

app.get("/edittracklist", async function(req,res){
	const tid = req.query['tid'];
	const trackobject = db.collection("Track");
	const listdata = await trackobject.findOne({_id:new ObjectId(tid)});
	res.render("edittrack_view",{listdata:listdata});
});

app.post("/edittrackSubmit",async function(req,res){
	const trackobject = db.collection("Track");
	const updateResult = await trackobject.updateOne({_id:new ObjectId(req.body.tid)},{$set:{trackname: req.body.trackname,
		track_release_date: req.body.track_release_date,
		language: req.body.language,
		genre: req.body.genre}});
	if(updateResult.modifiedCount==1)
	{
		req.session.msg="Track updated";
	}
	else
		req.session.msg="Track can not updated";
	
	res.render("Main",{msg:req.session.msg});
	req.session.msg = ""; 
});

app.get("/deletetrack",async function(req,res){
	const trackobject = db.collection("Track");
	const result = await trackobject.deleteOne({_id:new ObjectId(req.query['tid'])});
	if(result.deletedCount==1)
		req.session.msg = "Record Deleted";
	else
		req.session.msg="Deletion fail";
	res.render("Main",{msg:req.session.msg});
	req.session.msg = ""; 
});

app.get("/editplaylist", async function(req,res){
	const pid = req.query['pid'];
	const playlistobject = db.collection("Playlist");
	const playlistdata = await playlistobject.findOne({_id:new ObjectId(pid)});
	res.render("editplaylist_view",{playlistdata:playlistdata});
});

app.post("/editplaylistSubmit",async function(req,res){
	const playlistobject = db.collection("Playlist");
	const updateResult = await playlistobject.updateOne({_id:new ObjectId(req.body.pid)},{$set:{
		title: req.body.
		title}});
	if(updateResult.modifiedCount==1)
	{
		req.session.msg="Album updated";
	}
	else
		req.session.msg="Album can not updated";
	
	res.render("Main",{msg:req.session.msg});
	req.session.msg = ""; 
});
app.get("/deleteplaylist",async function(req,res){
	const playlistobject = db.collection("Playlist");
	const result = await playlistobject.deleteOne({_id:new ObjectId(req.query['pid'])});
	if(result.deletedCount==1)
		req.session.msg = "Album Deleted";
	else
		req.session.msg="Deletion fail";
	res.render("Main",{msg:req.session.msg});
	req.session.msg = ""; 
});

app.get("/deletealbum",async function(req,res){
	const albumobject = db.collection("Albums");
	const result = await albumobject.deleteOne({_id:new ObjectId(req.query['tid'])});
	if(result.deletedCount==1)
		req.session.msg = "Album Deleted";
	else
		req.session.msg="Deletion fail";
	res.render("Main",{msg:req.session.msg});
	req.session.msg = ""; 
});
app.listen(8080,()=>{console.log("server running at port no 8080")});
