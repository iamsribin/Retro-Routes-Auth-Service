import jwt, { Secret } from "jsonwebtoken";
import "dotenv/config";

interface DecodedToken {
  clientId: string;
  role: string;
}

export class AuthController {
  isAuthenticated = async (call: any, callback: any) => {
    try {
      const { token, requiredRole } = call.request;
      console.log(token, requiredRole);

      if (!token) {
        return callback(null, { message: "No token provided" });
      }

      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN || "retro-routes"
      ) as DecodedToken;

      if (!decoded || !decoded.role) {
        return callback(null, { message: "Invalid token" });
      }
      console.log(decoded.role ,"!==", requiredRole);

      if (decoded.role !== requiredRole) {
        return callback(null, {
          message: `Access denied: ${requiredRole} role required`,
        });
      }

      callback(null, {
        userId: decoded.clientId,
        role: decoded.role,
        message: "",
      });
    } catch (error: any) {
      console.log("Token verification failed:", error.message);
      callback(null, { message: "Unauthorized" });
    }
  };

  verifyToken = async (call: any, callback: any) => {
    try {
      console.log("verifyToken calling...");
      
      const refreshToken = call.request.token as string;

      if (!refreshToken) {
        return callback(null, { message: "No refresh token provided" });
      }

      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN || "retro-routes"
      ) as DecodedToken;

      if (!decoded || !decoded.role) {
        return callback(null, { message: "Invalid refresh token" });
      }

      const refresh_token = jwt.sign(
        { clientId: decoded.clientId, role: decoded.role },
        process.env.REFRESH_TOKEN || "retro-routes",
        { expiresIn: "7d" }
      );

      const access_token = jwt.sign(
        { clientId: decoded.clientId, role: decoded.role },
        process.env.ACCESS_TOKEN || "retro-routes",
        { expiresIn: "15m" }
      );

      console.log("refresh_token",refresh_token);
      console.log("access_token",access_token);
      
    
      callback(null, { 
        access_token,
        refresh_token,
        message: "",
      });
    } catch (error: any) {
      console.log("Token refresh failed:", error.message);
      callback(null, { message: "Token refresh failed" });
    }
  };
}