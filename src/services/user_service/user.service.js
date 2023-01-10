import Models from "../../models/models.js";
import PasswordService from "../password_service/password.service.js";
import Utils from "../../utils/utils.js";


class UserService {
    static UserModel = Models.UserModel();
    static dataHidden = { /*_id: 0,*/ no_hp: 0, code: 0, active: 0, createdAt: 0, updatedAt: 0, password: 0, __v: 0, phone: 0, shop: 0}

    static async userLogin(data) {
        return new Promise(async(resolve, reject) => {
           try{
               let cekUser;
               if(!data.username && data.email) cekUser = await this.GetUser("email", data.email);
               if(data.username && !data.email) cekUser = await this.GetUser("username", data.username);
               if(!cekUser) return reject({message: "username or email not found"});
               if(! await PasswordService.compareHast(data.password, cekUser.password))
                   return reject({message: "Password not Match"});
               const token = await Utils.createToken({id: cekUser._id});
               resolve({
                  id: cekUser._id,
                  name: cekUser.name,
                  username: cekUser.username,
                  email: cekUser.email,
                  phone: cekUser.phone,
                  gender: cekUser.gender,
                  token: token
               });
           } catch (error){
               reject(error);
           }
        });
    }
    static async GetUser(by, data, hidden) {
        if(by === "id"){
            return this.UserModel.findById({_id: data}, hidden? this.dataHidden : {});
        }
        if(by === "username"){
            return this.UserModel.findOne({username: data}, hidden? this.dataHidden : {});
        }
        if(by === "search"){
            /* find by similar username */
            const count = await this.UserModel.find({username: {$regex: data, $options: "i"}}).count();
            const output = await this.UserModel.find({username: {$regex: data, $options: "i"}}, this.dataHidden).limit(data.limit).skip(data.offset);
            return {count, output}
        }
        if(by === "email"){
            return this.UserModel.findOne({email: data}, hidden? this.dataHidden : {});
        }
        const count = await this.UserModel.find({}).count();
        const output = await this.UserModel.find({},this.dataHidden).limit(data.limit).skip(data.offset);
        return {count, output}
    }

    static async CreateUser(data) {
        return new Promise(async(resolve, reject) => {
            try{
                const cekUser = await this.GetUser("username", data.username);
                if(cekUser) return reject({message: "username has ready registered!"});
                const cekEmail = await this.GetUser("email", data.email);
                if(cekEmail) return  reject({message: "email has ready registered!"});
                const create = new this.UserModel(data);
                await create.save();
                resolve({message: "Success Create New User"});
            }catch (error){
                reject(error);
            }
        });
    }

    static async updateUser(id, data) {
        return new Promise(async (resolve, reject) => {
           try{
               await this.UserModel.updateOne({_id: id}, data);
               resolve("success update");
           } catch (error){
               reject(error);
           }
        });
    }

    static async DeleteUser(id) {
        return new Promise(async (resolve, reject) => {
            try{
                const cekId = await this.GetUser("id", id);
                if(!cekId) return reject({message: "id not found"});
                await this.UserModel.deleteOne({_id: id});
                resolve({message: "success delete user"});
            }catch (error){
                reject(error);
            }
        })
    }
}

export default UserService;