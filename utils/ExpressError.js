class ExpressError extends Error{
    constructor(statusCOde,message){
        super();
        this.statusCode = statusCOde;
        this.message = message;
    }
}

module.exports = ExpressError;