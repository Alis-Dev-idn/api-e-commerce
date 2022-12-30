import mongoose from "mongoose";
const idShop = mongoose.Types.ObjectId;
class Models {

    static UserModel() {
        const UserModel = new mongoose.Schema({
            name: String,
            username: String,
            email: String,
            password: String,
            gender: String,
            phone: Number,
            birthday: Number,
            active: Boolean,
            shop: {
                _id: false,
                id: idShop,
                name: String
            }
        }, {timestamps: true});

        return mongoose.model("user", UserModel);
    }
}

export default Models;