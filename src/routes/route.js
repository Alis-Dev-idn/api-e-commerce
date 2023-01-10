import express, {Router} from "express";
import UserController from "../controllers/user.controller.js";
import Utils from "../utils/utils.js";

class ExpressRoute {
    static route = express();
    static user = Router();
    static Route() {
        this.route.use("/user", this.User());

        this.route.use('/favicon.ico', express.static('./public/assets/icon/favicon.ico'));
        this.route.use((req, res) => {
            res.status(400).json({error: "endpoint not found", message: "please cek your url endpoint"});
        });
        return this.route;
    }

    static User() {
        this.user.get("/", UserController.GetUser);
        this.user.post("/", Utils.middleware, UserController.CreateUser);
        this.user.delete("/", UserController.deleteUser);
        this.user.post("/login", UserController.userLogin);

        return this.user;
    }
}

export default ExpressRoute;
