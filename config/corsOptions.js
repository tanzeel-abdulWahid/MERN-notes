import allowedOrigins from "./allowedOrigins.js";

const corsOptions = {
        origin: (origin, callback) => {
                //* not origin is for postman or other soft to test API
                if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
                        // * first arg is for error which is null in this case and second is boolean which is true in this case
                        callback(null, true);
                }else{
                        callback(new Error('Invalid origin argument'));
                }
        },
        credentials: true,
        optionsSuccessStatus: 200
}

export default corsOptions;