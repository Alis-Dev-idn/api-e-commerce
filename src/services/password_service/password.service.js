import bcrypt from "bcrypt";
class PasswordService {

    static async generateHast(password) {
        const hast = await bcrypt.genSaltSync(15);
        return await bcrypt.hash(password, hast);
    }

    static async compareHast(password, hast) {
        return await bcrypt.compare(password, hast);
    }
}

export default PasswordService;