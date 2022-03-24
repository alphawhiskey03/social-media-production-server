module.exports.validateRegisterInput = (
  username,
  password,
  confirmPassword,
  email
) => {
  let errors = {};
  if (username.trim() === "") {
    errors.username = "Username cannot be empty";
  }
  if (email.trim() === "") {
    errors.email = "Email cannot be empty";
  } else {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(regex)) {
      errors.email = "Email must be a valid email address";
    }
  }
  if (password === "") {
    errors.password = "Password cannot be empty";
  } else {
    if (password !== confirmPassword) {
      errors.password = "Password and the confirm password don't match";
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLogin = (username, password) => {
  let errors = {};
  if (username.trim() === "") {
    errors.username = "Invalid username";
  }

  if (password.trim === "") {
    errors.password = "Invalid password";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
