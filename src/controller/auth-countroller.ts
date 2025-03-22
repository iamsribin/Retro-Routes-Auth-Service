import jwt, { Secret } from 'jsonwebtoken'
import "dotenv/config"


export class Authcontroller {

    verifyToken = async(call:any, callback:any) => {
        try{
            const refreshtoken = call.request.token as string;
            const decoded: any = jwt.verify(refreshtoken, process.env.REFRESH_TOKEN ||"sribin" as Secret);
            console.log("token refreshed ");
            if(!decoded){
                throw new Error("invalid token  ");
            }

            const refreshToken = jwt.sign({id: decoded.id, role: decoded.role}, process.env.REFRESH_TOKEN ||"sribin" as Secret, {
                expiresIn: "7d"
            });

            const accessToken = jwt.sign({id: decoded.id, role: decoded.role}, process.env.ACCESS_TOKEN ||"sribin"as Secret, {
                expiresIn: "15m"
            });

            const response = {accessToken, refreshToken}
            callback(null, response)
        }catch(e:any){
            console.log(e);  
            callback(e, {message:"something gone wrong in authentication"})
        }
    }
}