const Mongoose = require("mongoose");

const productSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true,
  },
  price: {
    type: Number, 
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  img: {
    type: String,
    required: true,  
  },
  description: {
    type: String, 
    required: true, 
  },
  mfg: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  access: {
    type: Boolean,
    default: true,
  },
});   

module.exports = Mongoose.model("product", productSchema);

// const products = [
//   {
//     name: "AIR-KING",
//     price: "₹ 912,000",
//     description: " 40 mm, Oystersteel",
//     image:
//       "https://preview.colorlib.com/theme/timezone/assets/img/gallery/popular1.png",
//   },
//   {
//     name: "GMT-MASTER II",
//     price: "₹ 680,000",
//     description: " 40 mm, Everose gold",
//     image:
//       "https://preview.colorlib.com/theme/timezone/assets/img/gallery/popular2.png",
//   },
//   {  
//     name: "DAY-DATE 40",
//     price: "₹ 560,000",
//     description: "Oyster, 40 mm, platinum",
//     image:
//       "https://preview.colorlib.com/theme/timezone/assets/img/gallery/popular3.png",
//   },
//   {
//     name: "YACHT-MASTER 42",
//     price: "₹ 1,160,000",
//     description: " 42 mm, yellow gold",
//     image:
//       "https://preview.colorlib.com/theme/timezone/assets/img/gallery/popular4.png",
//   },
//   {
//     name: "DATEJUST 36",
//     price: "₹ 2,520,000",
//     description: " 36 mm, yellow gold",
//     image:
//       "https://preview.colorlib.com/theme/timezone/assets/img/gallery/popular5.png",
//   },
//   {
//     name: "SUBMARINER",
//     price: "₹ 2,160,000",
//     description: "41 mm, Oystersteel",
//     image:
//       "https://preview.colorlib.com/theme/timezone/assets/img/gallery/popular6.png",
//   },
// ];

// module.exports = products;
