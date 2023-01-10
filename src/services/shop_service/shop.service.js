import Models from "../../models/models.js";
import UserService from "../user_service/user.service.js";


class ShopService {
    static shopModel = Models.shop();

    static async getShop(by, value, params) {
        return new Promise(async (resolve, reject) => {
            try{
                if (by === "name") {
                   const response = await this.shopModel.findOne({name: value});
                   resolve(response);
                }
                if (by === "search") {
                    const count = await this.shopModel.find(value? {name: {$regex: value, $options: "i"}} : null).count().exec();
                    const data = await this.shopModel.find(value? {name: {$regex: value, $options: "i"}} : {} , {updatedAt: 0, __v: 0}).limit(params.limit).skip(params.skip).sort({createdAt: -1}).exec();
                    return resolve({count, data});
                }
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
               const cekShop = await this.getShop("name", data.name);
               if(cekShop) return reject({message: "name ready used"});
               const create = new this.shopModel(data);
               await create.save();
               const getIdShop = await this.getShop("name", data.name);
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