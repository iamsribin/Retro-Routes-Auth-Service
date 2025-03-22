import path from "path"; 
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import "dotenv/config"

import { Authcontroller } from "./controller/auth-countroller";

const authcontroller = new Authcontroller();

const packageDef = protoLoader.loadSync(path.resolve(__dirname,"./proto/auth.proto"),{
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const grpcObject = grpc.loadPackageDefinition(packageDef) as unknown as any;
const authpackage = grpcObject.authpackage;

if(!authpackage || !authpackage.Auth || !authpackage.Auth.service){
  console.error("Failed to load the User service from the proto file.");
  process.exit(1);
}


const server = new grpc.Server();

server.addService(authpackage.Auth.service,{
VerifyToken:authcontroller.verifyToken,
});

const grpcServer = () =>{
  const port = process.env.PORT;
  const Domain = process.env.NODE_ENV ==="dev" ? process.env.DEV_DOMAIN : process.env.PRO_DOMAIN_USER;

  server.bindAsync(`${Domain}:${port}`,grpc.ServerCredentials.createInsecure(),(err,bindPort)=>{
    if(err){
      console.error("Error starting gRPC server:", err);
     return      
    }

    console.log(`gRPC auth server started on port:${bindPort}`);
    
  })
}

grpcServer()



