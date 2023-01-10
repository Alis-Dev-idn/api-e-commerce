import express, {Router} from "express";
import UserController from "../controllers/user.controller.js";
import Utils from "../utils/utils.js";
import ShopController from "../controllers/shop.controller.js";

class ExpressRoute {
    static route = express();
    static user = Router();
    static shop = Router();

    static Route() {
        this.route.use("/user", this.User());
        this.route.use("/shop", this.shopRoute());

        this.route.use('/favicon.ico', express.static('./public/assets/icon/favicon.ico'));
        this.route.use((req, res) => {
            res.status(400).json({error: "endpoint not found", message: "please cek your url endpoint"});
        });
        return this.route;
    }

    static User() {
        this.user.get("/", UserController.GetUser);
        this.user.post("/", UserController.CreateUser);
        this.user.delete("/", Utils.middleware, UserController.deleteUser);
        this.user.post("/login", UserController.userLogin);

        return this.user;
    }

    static shopRoute() {
        this.shop.get("/", ShopController.getShop);
        this.shop.post("/", Utils.middleware, ShopController.createShop);
        this.shop.put("/", ShopController.updateShop);
        this.shop.delete("/", ShopController.deleteShop);

        return this.shop;
    }
}

export default ExpressRoute;
