
const Mongoose = require("mongoose");
const products = require("../models/product");

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
  console.log(product,'jkkkkkkkkkkkkkkkkkkkkkkkkkkk');
  let prid= product._id.toString() 
  console.log(prid);
  let cart = this.cart;
  const isExisting = cart.items.findIndex(
    (objInItems=> objInItems.productId == prid)
  );
  console.log(isExisting,"daaaaaaaaaaaaa");
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
  console.log(isExisting+'ivideeeeeeeeeeeee');
  if (isExisting>=0) {

    cart.items.splice(isExisting,1);
   
    return this.save()   
  }
}



userSchema.methods.changeQty = async function (productId, qty, count, cb) {
  console.log("change qty is running");
  const cart = this.cart

  const quantity = parseInt(qty)
  const cnt = parseInt(count)

  const response = {}
  const product = await products.findOne({ _id: productId })
  if (cnt === -1 && quantity === 1) {
    const Existing = cart.items.findIndex(objitems => objitems.product_id == productId)
    cart.items.splice(Existing, 1)
    cart.totalPrice -= product.price
    response.remove = true
  } else if (cnt === 1) {
    const Existing = cart.items.findIndex(objitems => objitems.product_id == productId)
    if (cart.items[Existing].qty < product.stock) {
      cart.items[Existing].qty += cnt

      cart.totalPrice += product.price
      response.status = cart.items[Existing].qty
    } else {
      response.stock = true
    }
  } else if (cnt === -1) {
    const Existing = cart.items.findIndex(objitems => objitems.product_id == productId)
    cart.items[Existing].qty += cnt

    cart.totalPrice -= product.price
    response.status = cart.items[Existing].qty
  }
  this.save().then((doc) => {
    response.total = doc.cart.totalPrice
    cb(response)
  })
}
 

module.exports = Mongoose.model("users", userSchema);

// module.exports = User = Mongoose.model('users', userSchema)
