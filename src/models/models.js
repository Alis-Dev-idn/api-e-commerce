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
            shop: [
                {
                    _id: false,
                    id: idShop,
                    name: String
                }
            ]
        }, {timestamps: true});

        return mongoose.model("user", UserModel);
    }

    static shop() {
        const shopModel = new mongoose.Schema({
            name: String,
            image: String,
            description: String,
            rating: Number,
            operation: {
                _id: false,
                open: Date,
                close: Date
            }
        }, {timestamps: true});

        return mongoose.model("shop", shopModel);
    }
}

export default Models;