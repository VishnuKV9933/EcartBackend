const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const user=require('../Models/User')
const productModel=require('../Models/Product')
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.userJwtKey, {
    expiresIn: maxAge,
  });
};

const handleErrors = (err) => {
  let errors = { email: "", password: "" };
  console.log(err);
  if (err.keyPattern?.email === 1) {
    errors.email = "email is already in use";
    return errors;
  }
  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
    return errors;
  }
};

const handleErr = (err) => {
  let errors = { email: "", password: "" };
  if (err.message === "Email not in use") {
    errors.email = "Email not in use";
    return errors;
  } else if (err.message === "wrong pasword") {
    errors.password = "wrong pasword";
    return errors;
  } else if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
    return errors;
  }
};

const verifyUser = (req, res, next) => {

  try {
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
  
        if (token) {
            jwt.verify(token,process.env.userJwtKey, async (err, decodedToken) => {
                if (err) {
                   res.json({error:"Unauthorized request"})
                } else {
                    const User = await user.findById(decodedToken.id);
                    if (User) {
                      next();
                    } else {
                      res.json({error:"Unauthorized request"})
                    } 
                }
            }); 
        }else{ 
          res.json({error:"Unauthorized request"})
        }
  } catch (error) {
    console.log(error);
  }

    }
  



const Register = async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new user({
      username: req.body.name,
      email: req.body.email,
      password: hashPassword,
    });

    await newUser.save().then((user) => {
      const token = createToken(user._id);

      res.status(200).json({ user: user, token: token, created: true });
    });
  } catch (err) {
    const errors = handleErrors(err);
    console.log(errors);

    res.json({ errors, created: false });
  }
};

const Login = async (req, res) => {
 

  try {
    const loginUser = await user.findOne({ email: req.body.email });
   
    if (!loginUser) {
      throw new Error("Email not in use");
    }
    if (loginUser) {
     
      const validpassword = await bcrypt.compare(
        req.body.password,
        loginUser.password
      );

      if (!validpassword) {
        throw new Error("wrong pasword");
      }

      if (validpassword) {
    
          const token = createToken(loginUser._id);

          res.status(200).json({ loginUser: loginUser, token: token });
    
      }
    }
  } catch (err) {
    const errors = handleErr(err);
    console.log(errors,'eror');

    res.json({ errors, loginfail: true });
  }
};

const products=async(req,res)=>{ 

try {

  const skip=req.params.page*6

  const results = await productModel.aggregate([
    {
      $facet: {
        totalDocuments: [{ $count: 'count' }],
        products: [{ $skip: skip }, { $limit: 6 }],
      },
    },
  ]);

  const totalDocuments = results[0].totalDocuments[0].count;
  const products = results[0].products;
  
  res.json({products,totalDocuments})
  
} catch (error) {
  console.log(error);
}


}

module.exports = {
  Register,
  Login,
  verifyUser,
  products
};
