export default class ApiError{
    constructor(error = "Oops, Something went wrong.") {
        this.message = error
    }
}