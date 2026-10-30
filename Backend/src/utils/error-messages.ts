class ErrorMessages {

    public error405() {
        return {
            jsonrpc: "2.0",
            error: {
                code: -32000,
                message: "Method not allowed"
            },
            id: null
        };
    }

    public error401() {
        return {
            jsonrpc: "2.0",
            error: {
                code: -32001,
                message: "Unauthorized"
            },
            id: null
        }
    }

}

export const errorMessages = new ErrorMessages();