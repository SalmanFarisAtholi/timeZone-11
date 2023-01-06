
const Mongoose = require("mongoose");


const userSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
  },
  access: {
    type: Boolean,
    default: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Mongoose.Schema.Types.ObjectId,
          ref: 'product',
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: Number,
  },

})

userSchema.methods.addToCart = function (product) {
  // console.log(product,'jkkkkkkkkkkkkkkkkkkkkkkkkkkk');
  let cart = this.cart;
  const isExisting = cart.items.findIndex(
    (objInItems) => objInItems.productId == product._id
  );
  console.log(isExisting);
  if (isExisting >= 0) {
    console.log("kooooooooooi");
    cart.items[isExisting].qty += 1;
  } else {
    cart.items.push({ productId: product._id, qty: 1 });
  }
  if (!cart.totalPrice) {
    cart.totalPrice = 0;
  }

  cart.totalPrice += product.price;

  console.log("user in scheemaa:", this);

  return this.save();
};

userSchema.methods.removeFromCart=function (product) {
  let cart =this.cart;
  const isExisting = cart.items.findIndex(
    (objInItems) => objInItems.product == product._id
  );
  console.log(isExisting+'ivifeeeeeeeeeeeee');
  if (isExisting>=0) {
    console.log(product.price+'my');
    console.log(cart.totalPrice+'hhhhhhhhhhhhhhh');
    cart.items.splice(isExisting,1);
  

    return this.save()
  }
}

// userSchema.methods.changeQty = async function (productId, qty, count, cb) {
//   const cart = this.cart
//   console.log(qty)
//   const quantity = parseInt(qty)
//   const cnt = parseInt(count)
//   console.log('%%%%%%' + quantity)
//   const response = {}
//   const product = await products.findOne({ _id: productId })
//   if (cnt == -1 && quantity == 1 || cnt == -2) {
//     const Existing = cart.items.findIndex(objitems => {
//      return new String(objitems.product_id).trim() == new String(productId).trim()});

//     cart.items.splice(Existing, 1)
//     cart.totalPrice -= product.price * qty
//     response.remove = true
//   } else if (cnt == 1) {
//     console.log('hiii-plus')
//     const Existing = cart.items.findIndex(objitems => {
//       return new String(objitems.product_id).trim() == new String(productId).trim()});
      

//     cart.items[Existing].qty += cnt
//     console.log(cart.items[Existing].qty)
//     cart.totalPrice += product.price
//     response.status = cart.items[Existing].qty
//   } else if (cnt == -1) {
//     console.log('hiiiiiii-minus')
//     const Existing = cart.items.findIndex(objitems => {
//       return new String(objitems.product_id).trim() == new String(productId).trim()});
     

//     cart.items[Existing].qty += cnt
//     console.log(cart.items[Existing])
//     cart.totalPrice -= product.price
//     response.status = cart.items[Existing].qty
//   }
//   this.save().then((doc) => {
//     response.total = doc.cart.totalPrice
//     cb(response)
//   })
// }


module.exports = Mongoose.model("users", userSchema);

// module.exports = User = Mongoose.model('users', userSchema)
