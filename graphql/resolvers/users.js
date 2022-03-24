const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../config");
const { UserInputError } = require("apollo-server");
const {
  validateRegisterInput,
  validateLogin,
} = require("../../utils/validators");

const generateToken = async (email, id, username) => {
  let token = jwt.sign(
    {
      email: email,
      id: id,
      username: username,
    },
    SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
  return token;
};

module.exports = {
  Mutation: {
    register: async (
      parent,
      { registerInput: { username, password, confirmPassword, email } },
      context,
      info
    ) => {
      //  Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        password,
        confirmPassword,
        email
      );
      if (!valid) {
        throw new UserInputError("Errors", errors);
      }

      //  make sure user doesnt already exist
      const user = await User.findOne({ username });

      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }
      // hashing and auth token
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();
      const token = generateToken(res.email, res.id, res.username);
      return { ...res._doc, id: res.id, token };
    },
    login: async (parent, { loginInput: { username, password } }) => {
      const { errors, valid } = validateLogin(username, password);
      const user = await User.findOne({ username });
      if (!valid) {
        throw new UserInputError("Erros", { errors });
      }
      if (!user) {
        errors.username = "User not found";
        throw new UserInputError("Error", { errors });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.password = "Invalid credentials";
        // console.log(errors);

        throw new UserInputError("Error", { errors });
      }
      const token = generateToken(user.email, user.id, user.username);
      return {
        ...user._doc,
        id: user.id,
        token,
      };
    },
  },
};
