if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const indexRouter = require("./routes/index");
const adminRouter = require("./routes/admin");
const session = require("express-session");
const nocache = require("nocache");
const morgan = require("morgan");
const multer = require("multer");


const fileStorage = multer.diskStorage({
  // Destination to store image
  destination: "public/images",
  filename: (req, file, cb) => {
    cb(Date().toISOull, new String().replace(/:/g, "-") + file.originalname);
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"||
    file.mimetype === "image/webp"

  ) {
    // upload only png and jpg format

    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");

app.use(nocache());
app.use(expressLayouts);
app.use(express.static("public"));
app.use(
  session({
    secret: "key",
    cookie: { maxAge: 60000000 },
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  multer({ storage: fileStorage, fileFilter }).fields([
    { name: "img" },
    { name: "images", maxCount: 5 },
  ])
);
app.use(express.json())

const DATABASE_URL = process.env.DATABASE_URL;

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

app.use("/", indexRouter);
app.use("/admin", adminRouter);

app.use(function(req, res, next) {
  const error = new Error(`Not found ${req.originalUrl}`)
  error.status = 404
  next(error)
    });
    
    // error handler
    app.use(function(err, req, res, next) {
  console.log(err);
      // render the error page
      res.status(err.status || 500);
      if(err.status==404){
        if(err.admin){
          res.render('404_error_admin',{error:err.message});
        }else{
          res.render('404_error',{error:err.message});
        }

      }else{
        if(err.admin){
          res.render('404_error_admin',{error:'server down'})
        }else{
          res.render('404_error',{error:'server down'})
        }
       
      }
   
    });

app.listen(process.env.PORT || 3000, (err) => {
  if (err) console.log(err);
  else console.log("server running successfully");
});


