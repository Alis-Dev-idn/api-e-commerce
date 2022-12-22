import mongoose from "mongoose";

class Models {

    static UserModel() {
        const UserModel = new mongoose.Schema({
            name: String,
            username: String,
            email: String,
            password: String,
            active: Boolean
        }, {timestamps: true});

        return mongoose.model("user", UserModel);
    }
}

export default Models;