const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sendValidationError = (res, message) =>
  res.status(400).json({ message });

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (typeof name !== "string" || name.trim().length < 2) {
    return sendValidationError(res, "Name must be at least 2 characters long");
  }

  if (typeof email !== "string" || !emailPattern.test(email.trim())) {
    return sendValidationError(res, "A valid email address is required");
  }

  if (typeof password !== "string" || password.length < 8) {
    return sendValidationError(res, "Password must be at least 8 characters long");
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password, selectedRole } = req.body;

  if (typeof email !== "string" || !emailPattern.test(email.trim())) {
    return sendValidationError(res, "A valid email address is required");
  }

  if (typeof password !== "string" || password.length === 0) {
    return sendValidationError(res, "Password is required");
  }

  if (!["employee", "manager"].includes(selectedRole)) {
    return sendValidationError(res, "Please select Employee or Manager login");
  }

  next();
};

export { validateLogin, validateRegister };
