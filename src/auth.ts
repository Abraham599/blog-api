import { Hono, Next } from "hono";
import { Jwt } from "hono/utils/jwt";


const app = new Hono();

export async function authMiddleware(c:any,next:Next) {
    const JWT_SECRET = "0e0a22d5c7c6ae862cf6558ed1be647ee2c57eef93900d0d30130e44e728c434";
    const auth = c.req.header("Authorization");

    if(auth===null || auth===undefined){
        return c.json({
            msg:"Wrong token"
        });
    }

    try{
        const decoded = await Jwt.verify(auth,JWT_SECRET);
        c.req.userID = decoded;
        await next();
    }
    catch(err){
        console.log("Error", err);
    }
}