class ExpressError
    extends Error {
        constructor (message, statusCode) {
            super();
            this.message = message;
            this.statusCode = statusCode;
        }
    }

module.exports = {
    ExpressError,
    notFound: (req, res, next) => {
        next(new ExpressError("Page Not Found", 404));
    },
    renderError: (err, req, res, next) => {
        const { statusCode = 500 } = err;

        if (!err.message) err.message = "Something went wrong, inform media team of the bug ASAP!";
    
        res.status(statusCode).render("../utils/errors/error", { err });
    }
}