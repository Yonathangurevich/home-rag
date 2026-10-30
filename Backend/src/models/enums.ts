export enum StatusCode {

    // Success: 
    OK = 200,
    Created = 201,
    NoContent = 204,

    // Client Errors:
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    MethodNotAllowed = 405,
    Conflict = 409,
    UnprocessableContent = 422,
    // TooManyRequests = 429,

    // Server Errors:
    InternalServerError = 500
    
}

