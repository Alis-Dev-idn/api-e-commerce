import Models from "../../models/models.js";
import UserService from "../user_service/user.service.js";


class ShopService {
    static shopModel = Models.shop();

    static async getShop(name) {
        return new Promise(async (resolve, reject) => {
            try{
                let result;
                if(name) result = await this.shopModel.findOne({name: name});
                if(!name) {
                    const count = await this.shopModel.find().count();
                    const data = await this.shopModel.find();
                    result = {count, data};
                }
                resolve(result);
            }catch (error){
                reject(error);
            }
        });
    }

    static async createShop(id, data) {
        return new Promise(async(resolve, reject) => {
           try{
               const cekUser = await UserService.GetUser("id", id, false);
               if(!cekUser) return  reject({message: "user not found"});
               const cekShop = await this.getShop(data.name);
               if(cekShop) return reject({message: "name ready used"});
               const create = new this.shopModel(data);
               await create.save();
               const getIdShop = await this.getShop(data.name);
               cekUser.shop.push({id: getIdShop._id, name: data.name})
               await UserService.updateUser(id, cekUser);
               resolve("success create new shop");
           } catch (error){
               reject(error);
           }
        });
    }
}

export default ShopService;