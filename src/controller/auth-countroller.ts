import jwt, { Secret } from 'jsonwebtoken'
import "dotenv/config"

export class Authcontroller {

    isAuthenticated = async(call:any, callback:any)=>{
        try{
            console.log("token validating...");
            const token = call.request.token || '';  
                        
            const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN || "sribin" as Secret);

            if(!decoded){
                throw new Error('Invalid token')
            }
            
            callback(null,{userId : decoded.id, role: decoded.role})
        }catch(e: any){
            console.log(e);
            
            callback(e, {message:"something gone wrong in authentication"})
         }
    }

    verifyToken = async(call:any, callback:any) => {
        try{
            console.log("veryfing token...");
            
            const refreshtoken = call.request.token as string;
            const decoded: any = jwt.verify(refreshtoken, process.env.REFRESH_TOKEN ||"sribin" as Secret);

            if(!decoded){
                throw new Error("invalid token  ");
            }

            const refresh_token = jwt.sign({id: decoded.id, role: decoded.role}, process.env.REFRESH_TOKEN ||"sribin" as Secret, {
                expiresIn: "7d"
            });

            const access_token = jwt.sign({id: decoded.id, role: decoded.role}, process.env.ACCESS_TOKEN ||"sribin"as Secret, {
                expiresIn: "15m"
            });

            const response = {access_token, refresh_token}
            callback(null, response)
        }catch(e:any){
            console.log(e);  
            callback(e, {message:"something gone wrong in authentication"})
        }
    }
}