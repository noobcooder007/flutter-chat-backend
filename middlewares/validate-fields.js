const { validationResult } = require("express-validator");

const validateFields = (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errs.mapped()
        });
    }
    next();
}

module.exports = {
    validateFields
}