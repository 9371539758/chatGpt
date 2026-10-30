export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  const errors = [];

  // Name validation
  if (!name || typeof name !== "string" || !name.trim()) {
    errors.push({
      field: "name",
      message: "Name is required",
    });
  } else if (name.trim().length < 2 || name.trim().length > 50) {
    errors.push({
      field: "name",
      message: "Name must be between 2 and 50 characters",
    });
  }

  // Email validation
  if (!email || typeof email !== "string" || !email.trim()) {
    errors.push({
      field: "email",
      message: "Email is required",
    });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push({
      field: "email",
      message: "Please enter a valid email address",
    });
  }

  // Password validation
  if (typeof password !== "string" || !password) {
    errors.push({
      field: "password",
      message: "Password is required",
    });
  } else if (password.length < 8 || password.length > 128) {
    errors.push({
      field: "password",
      message: "Password must be between 8 and 128 characters",
    });
  }

  // Return all validation errors together
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // Normalize valid input
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();

  next();
};
export const validateLogin = (req, res, next) => {
  const { identifier, password } = req.body;

  const errors = [];

  if (
    typeof identifier !== "string" ||
    !identifier.trim()
  ) {
    errors.push({
      field: "identifier",
      message: "Email or name is required",
    });
  }

  if (typeof password !== "string" || !password) {
    errors.push({
      field: "password",
      message: "Password is required",
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  req.body.identifier = identifier.trim();

  next();
};