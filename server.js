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
app.use(morgan("combined"));
app.use(
  multer({ storage: fileStorage, fileFilter }).fields([
    { name: "img" },
    { name: "images", maxCount: 5 },
  ])
);

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1/timeZone");
const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

app.use("/", indexRouter);
app.use("/admin", adminRouter);

app.listen(process.env.PORT || 3000, (err) => {
  if (err) console.log(err);
  else console.log("server running successfully");
});
