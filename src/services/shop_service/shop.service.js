import Models from "../../models/models.js";
import UserService from "../user_service/user.service.js";


class ShopService {
    static shopModel = Models.shop();

    static async getShop(by, value, params) {
        return new Promise(async (resolve, reject) => {
            try{
                if (by === "id") {
                    const data = await this.shopModel.find(
                        params.name? {id: value, name: {$regex: params.name, $options: "i"}} : {id: value},
                        {id: 0, updatedAt: 0, __v: 0}).sort({createdAt: -1}).skip(params.skip).limit(params.limit);
                    resolve({count : data.length, data});
                }
                if (by === "name") {
                   const response = await this.shopModel.findOne({name: value});
                   resolve(response);
                }
                if (by === "search") {
                    const data = await this.shopModel.find(
                        value? {name: {$regex: value, $options: "i"}} : {} ,
                        {id: 0, updatedAt: 0, __v: 0}).limit(params.limit).skip(params.skip).sort({createdAt: -1}).exec();
                    return resolve({count : data.length, data});
                }
                if (by === "all") {
                    const data = await this.shopModel.aggregate([
                        {$sample: {size: params.limit}},
                        {$project: {id: 0, updatedAt: 0, __v: 0}},
                        {$match: {
                            $and: [
                                params.name? {name: {$regex: params.name, $options: "i"}} : {}
                            ]
                        }}
                    ]).exec();
                    resolve({count: data.length, data});
                }
            }catch (error){
                reject(error);
            }
        });
    }

    static async createShop(id, data) {
        return new Promise(async(resolve, reject) => {
           try{
               const test = await this.getShop("all", 2);
               console.log(test);
               const cekUser = await UserService.GetUser("id", id, false);
               if(!cekUser) return  reject({message: "user not found"});
               const cekShop = await this.getShop("name", data.name);
               if(cekShop) return reject({message: "name ready used"});
               data.id = id;
               const create = new this.shopModel(data);
               await create.save();
               resolve("success create new shop");
           } catch (error){
               reject(error);
           }
        });
    }
}

export default ShopService;