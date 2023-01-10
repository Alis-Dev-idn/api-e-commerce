import joi from "joi";
import mongoose from "mongoose";

class JoiService {

    static CreateUser = joi.object({
       name: joi.string().min(4).required(),
       username: joi.string().min(5).required(),
       email: joi.string().email().required(),
       password: joi.string().min(6).required(),
       active: joi.boolean().default(false).allow(null),
       gender: joi.string().required(),
       phone: joi.number().min(11).required(),
       birthday: joi.date().required(),
       shop: joi.object({
           id: joi.string().required(),
           name: joi.string().min(5).required()
       }).allow(null)
    });

    static createShop = joi.object({
        name: joi.string().min(5).required(),
        image: joi.string().allow(null),
        description: joi.string().required(),
        rating: joi.number().default(0),
        operation: joi.object({
            open: joi.date().required(),
            close: joi.date().required()
        }).allow(null),
    });

    static IdValidate(id) {
        const idObject = mongoose.Types.ObjectId;
        if(idObject.isValid(id)){
            return (String)(new Object(id)) === id;

        }
        return false;
    }
}

export default JoiService;