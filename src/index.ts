import { PrismaClient } from '@prisma/client/edge';
import { Hono } from 'hono';
import { Jwt } from 'hono/utils/jwt';
import { ZodType, string, z } from 'zod';
import { withAccelerate } from '@prisma/extension-accelerate'
import { authMiddleware } from './auth';
import { cors } from 'hono/cors';
import { router } from './routes';
const app = new Hono();

app.use("/api/*",cors());
app.route("/api/v1/user",router);
// const JWT_SECRET = "0e0a22d5c7c6ae862cf6558ed1be647ee2c57eef93900d0d30130e44e728c434";


// interface SignupReqBody{
//   username:string;
//   email:string;
//   password:string;
// }

// const signupBody:ZodType<SignupReqBody> = z.object({
//   username: z.string().min(4).max(30),
//   email:z.string().email(),
//   password:z.string().min(6).max(30)

// });

// app.post('/signup',async (c:any)=>{
//   const body: SignupReqBody = await c.req.json();
//   const JWT_SECRET = "0e0a22d5c7c6ae862cf6558ed1be647ee2c57eef93900d0d30130e44e728c434";

// const prisma = new PrismaClient({
//     datasourceUrl: "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNWI5YmU0ODAtYWQ2Zi00OTEwLThmZGItMGVmNWI4ZWI4M2UwIiwidGVuYW50X2lkIjoiMzUxZDEzNmUyNjFkNDk0OGM4Y2ZiOTBjODc4OWEwMTUwOTU4Njg5NzYwYTI4MGIwM2E2ZTkwZWJlMWIxNGIwYSIsImludGVybmFsX3NlY3JldCI6IjQ2OWExNWFjLTNkNDctNGRlYy04ZmJhLTM5ZDVkMWZiOTA3MSJ9.XlUVS0D6hk0nJeVJPgyldFRunAXyxgEfnM2dMKMTOfo",
// }).$extends(withAccelerate());

// const {success} = signupBody.safeParse(body);

//   if(!success){
//     return c.json({
//       msg:"Email is incorrect / Password is min length is 6"
//     });
//   }

//   const existingUser = await prisma.user.findFirst({
//     where:{
//       username:body.username
//     }
//   });
//   if(existingUser){
//     return c.json({
//       msg: "User already exists"
//     })
//   }
//   const res = await prisma.user.create({
//     data:{
//       username : body.username,
//       email : body.email,
//       password : body.password
//     }
//   });

//   const userID = res.id; 
//   // if (!process.env.JWT_SECRET) {
//   //   throw new Error('JWT_SECRET is not defined');
//   // }

//   const token = await Jwt.sign(userID,JWT_SECRET);

//   return c.json({
//     msg:"Account was created successfully",
//     token:token
//   });
// });
// interface SigninReqBody {
//   email:string;
//   password:string;
// }

// const signinBody:ZodType<SigninReqBody> = z.object({
//   email:z.string().email(),
//   password:z.string().min(6).max(30)

// });

// app.post("/signin",async(c)=>{
//   const body:SigninReqBody = await c.req.json();
//   const {success} = signinBody.safeParse(body);
//   const prisma = new PrismaClient({
//     datasourceUrl: "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNWI5YmU0ODAtYWQ2Zi00OTEwLThmZGItMGVmNWI4ZWI4M2UwIiwidGVuYW50X2lkIjoiMzUxZDEzNmUyNjFkNDk0OGM4Y2ZiOTBjODc4OWEwMTUwOTU4Njg5NzYwYTI4MGIwM2E2ZTkwZWJlMWIxNGIwYSIsImludGVybmFsX3NlY3JldCI6IjQ2OWExNWFjLTNkNDctNGRlYy04ZmJhLTM5ZDVkMWZiOTA3MSJ9.XlUVS0D6hk0nJeVJPgyldFRunAXyxgEfnM2dMKMTOfo",
// }).$extends(withAccelerate());

//   if(!success){
//     return c.json({
//       msg: "Wrong Email or password"
//     });
//   }
//   const doesUserExist = await prisma.user.findFirst({
//     where:{
//       email:body.email,
//       password:body.password
//     },
//   });

//   if(!doesUserExist){
//     return c.json({
//       msg:"User does not exist"
//     });
//   }
//   // const ID = await prisma.user.findUnique()
//   const userID = doesUserExist.id;
//   // console.log(userID);
//   // if (!process.env.JWT_SECRET) {
//   //   throw new Error('JWT_SECRET is not defined');
//   // }
//   const token = await Jwt.sign(userID,JWT_SECRET);
//   return c.json({
//     msg:"Login Successfull !",
//     token:token,
//   });
// });

// app.get("/posts",authMiddleware, async (c:any)=>{
//   const prisma = new PrismaClient({
//     datasourceUrl: "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNWI5YmU0ODAtYWQ2Zi00OTEwLThmZGItMGVmNWI4ZWI4M2UwIiwidGVuYW50X2lkIjoiMzUxZDEzNmUyNjFkNDk0OGM4Y2ZiOTBjODc4OWEwMTUwOTU4Njg5NzYwYTI4MGIwM2E2ZTkwZWJlMWIxNGIwYSIsImludGVybmFsX3NlY3JldCI6IjQ2OWExNWFjLTNkNDctNGRlYy04ZmJhLTM5ZDVkMWZiOTA3MSJ9.XlUVS0D6hk0nJeVJPgyldFRunAXyxgEfnM2dMKMTOfo",
// }).$extends(withAccelerate());
// const userID = await c.req.userID;
//   const doesUserExist = await prisma.user.findUnique({
//     where:{
//       id:userID
//     }
//   });

//   if(!doesUserExist){
//     return c.json({
//       msg:"User does not exist"
//     });
//   }
//   const res = await prisma.post.findMany({
//     where:{
//       userID:userID
//     }
//   });

//   return c.json({
//     posts:res
//   });

// })

// interface BlogFormat{
//     title:string;
//     content:string;
//     tags:string[];
    
// }

// app.post("/posts",authMiddleware, async (c:any)=>{
//   const prisma = new PrismaClient({
//     datasourceUrl: "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNWI5YmU0ODAtYWQ2Zi00OTEwLThmZGItMGVmNWI4ZWI4M2UwIiwidGVuYW50X2lkIjoiMzUxZDEzNmUyNjFkNDk0OGM4Y2ZiOTBjODc4OWEwMTUwOTU4Njg5NzYwYTI4MGIwM2E2ZTkwZWJlMWIxNGIwYSIsImludGVybmFsX3NlY3JldCI6IjQ2OWExNWFjLTNkNDctNGRlYy04ZmJhLTM5ZDVkMWZiOTA3MSJ9.XlUVS0D6hk0nJeVJPgyldFRunAXyxgEfnM2dMKMTOfo",
// }).$extends(withAccelerate());
// const userID = await c.req.userID;
//   const doesUserExist = await prisma.user.findUnique({
//     where:{
//       id:userID
//     }
//   });

//   if(!doesUserExist){
//     return c.json({
//       msg:"User does not exist"
//     });
//   } 
//   const body:BlogFormat = await c.req.json();
//   if(!body.title && !body.content){
//     return c.json({
//       msg:"Please complete the post ! (title & content)"
//     })
//   }
//   const res = await prisma.post.create({
//     data:{
//       title:body.title,
//       content:body.content,
//       tags:{
//         set:body.tags,
//       },
//       userID:c.req.userID
//     }
//   });
//   return c.json({
//     msg:"Your post was published successfully !",
//     post: res
//   });
// });

// app.get("/posts/:id", authMiddleware ,async (c:any)=>{
//   const prisma = new PrismaClient({
//     datasourceUrl: "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNWI5YmU0ODAtYWQ2Zi00OTEwLThmZGItMGVmNWI4ZWI4M2UwIiwidGVuYW50X2lkIjoiMzUxZDEzNmUyNjFkNDk0OGM4Y2ZiOTBjODc4OWEwMTUwOTU4Njg5NzYwYTI4MGIwM2E2ZTkwZWJlMWIxNGIwYSIsImludGVybmFsX3NlY3JldCI6IjQ2OWExNWFjLTNkNDctNGRlYy04ZmJhLTM5ZDVkMWZiOTA3MSJ9.XlUVS0D6hk0nJeVJPgyldFRunAXyxgEfnM2dMKMTOfo",
// }).$extends(withAccelerate());
// const userID = await c.req.userID;
//   const doesUserExist = await prisma.user.findUnique({
//     where:{
//       id:userID
//     }
//   });

//   if(!doesUserExist){
//     return c.json({
//       msg:"User does not exist"
//     });
//   } 

//   const id:number = Number(c.req.param("id"));

//   const res = await prisma.post.findUnique({
//     where:{
//       id:id,
//       userID:userID
//     }
//   });

//   if(!res){
//     return c.json({
//       msg:"Post does not exist for the user"
//     });
//   }
 
//   return c.json({
//     post:res
//   });
// });


// app.put("/posts/:id", authMiddleware ,async (c:any)=>{
//   const prisma = new PrismaClient({
//     datasourceUrl: "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNWI5YmU0ODAtYWQ2Zi00OTEwLThmZGItMGVmNWI4ZWI4M2UwIiwidGVuYW50X2lkIjoiMzUxZDEzNmUyNjFkNDk0OGM4Y2ZiOTBjODc4OWEwMTUwOTU4Njg5NzYwYTI4MGIwM2E2ZTkwZWJlMWIxNGIwYSIsImludGVybmFsX3NlY3JldCI6IjQ2OWExNWFjLTNkNDctNGRlYy04ZmJhLTM5ZDVkMWZiOTA3MSJ9.XlUVS0D6hk0nJeVJPgyldFRunAXyxgEfnM2dMKMTOfo",
// }).$extends(withAccelerate());
// const userID = await c.req.userID;
//   const doesUserExist = await prisma.user.findUnique({
//     where:{
//       id:userID
//     }
//   });

//   if(!doesUserExist){
//     return c.json({
//       msg:"User does not exist"
//     });
//   } 

//   const id:number = Number(c.req.param("id"));

//   let res = await prisma.post.findUnique({
//     where:{
//       id:id,
//       userID:userID
//     }
//   });

//   if(!res){
//     return c.json({
//       msg:"Post does not exist for the user"
//     });
//   }
//   const body:BlogFormat = await c.req.json();
//   res = await prisma.post.update({
//     where:{
//       id:id,
//       userID:userID
//     },
//     data:{
//       title:body.title,
//       content:body.content,
//       tags:{
//         set:body.tags,
//       }
//     }
//   });
//   return c.json({
//     msg:"Post updated !",
//     post:res
//   });


// });

// app.delete("/posts/:id", authMiddleware ,async (c:any)=>{
//   const prisma = new PrismaClient({
//     datasourceUrl: "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNWI5YmU0ODAtYWQ2Zi00OTEwLThmZGItMGVmNWI4ZWI4M2UwIiwidGVuYW50X2lkIjoiMzUxZDEzNmUyNjFkNDk0OGM4Y2ZiOTBjODc4OWEwMTUwOTU4Njg5NzYwYTI4MGIwM2E2ZTkwZWJlMWIxNGIwYSIsImludGVybmFsX3NlY3JldCI6IjQ2OWExNWFjLTNkNDctNGRlYy04ZmJhLTM5ZDVkMWZiOTA3MSJ9.XlUVS0D6hk0nJeVJPgyldFRunAXyxgEfnM2dMKMTOfo",
// }).$extends(withAccelerate());
// const userID = await c.req.userID;
//   const doesUserExist = await prisma.user.findUnique({
//     where:{
//       id:userID
//     }
//   });

//   if(!doesUserExist){
//     return c.json({
//       msg:"User does not exist"
//     });
//   } 

//   const id:number = Number(c.req.param("id"));

//   let res = await prisma.post.findUnique({
//     where:{
//       id:id,
//       userID:userID
//     }
//   });

//   if(!res){
//     return c.json({
//       msg:"Post does not exist for the user"
//     });
//   }
//   res = await prisma.post.delete({
//     where:{
//       id:id,
//       userID:userID
//     },

//   });
//   return c.json({
//     msg:"Post deleted !",
//     post:res
//   });


// })






export default app;
