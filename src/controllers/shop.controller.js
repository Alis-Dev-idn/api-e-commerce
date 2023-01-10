import ShopService from "../services/shop_service/shop.service.js";
import JoiService from "../services/joi_service/joi.service.js";


class ShopController {
    static async getShop(req, res) {
        const query = req.query;
        ShopService.getShop(query.name ? query.name : null).then((response) => {
            if(!response) return res.status(400).json({error: `shop by name ${query.name} not found`});
            res.status(200).json(response);
        }).catch(error => {
            res.status(500).json({error: "Internal Error"});
        });
    }

    static async createShop(req, res) {
        const body = req.body;
        const id = req.id;
        const {error} = JoiService.createShop.validate(body);
        if(error) return res.status(400).json({error: error.details[0].message});
        ShopService.createShop(id, body).then((response) => {
            res.status(200).json({message: response});
        }).catch(error => {
            if(error.message) return res.status(400).json({error: error.message});
            res.status(500).json({error: "Internal Error"});
        })
    }

    static async updateShop(req, res) {
        res.status(200).json({message: "update shop ok"});
    }

    static async deleteShop(req, res) {
        res.status(200).json({message: "delete shop ok"});
    }
}

export default ShopController;