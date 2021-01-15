export default {
    echo: {
        handler: (parameters) => {
            return parameters.contents;
        },
        parameters: {
            contents: "string"
        }
    }
};