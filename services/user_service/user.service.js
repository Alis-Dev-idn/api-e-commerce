import Models from "../../models/models.js";


class UserService {
    static UserModel = Models.UserModel();
    static dataHidden = { _id: 0, no_hp: 0, code: 0, active: 0, createdAt: 0, updatedAt: 0, password: 0, __v: 0 }

    static async GetUser(by, data, hidden) {
        if(by === "id"){
            return this.UserModel.findById({_id: data}, hidden? this.dataHidden : {});
        }
        if(by === "name"){
            return this.UserModel.findOne({name: data}, hidden? this.dataHidden : {});
        }
        if(by === "email"){
            return this.UserModel.findOne({email: data}, hidden? this.dataHidden : {});
        }
        const count = await this.UserModel.find({}).count();
        const output = await this.UserModel.find({},this.dataHidden);
        return {count, output}
    }
}

export default UserService;