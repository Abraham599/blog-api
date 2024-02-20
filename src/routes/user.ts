import { PrismaClient } from '@prisma/client/edge';
import { Jwt } from 'hono/utils/jwt';
import { ZodType, string, z } from 'zod';
import { withAccelerate } from '@prisma/extension-accelerate'

const JWT_SECRET = "0e0a22d5c7c6ae862cf6558ed1be647ee2c57eef93900d0d30130e44e728c434";
const prisma = new PrismaClient({
    datasourceUrl: "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNWI5YmU0ODAtYWQ2Zi00OTEwLThmZGItMGVmNWI4ZWI4M2UwIiwidGVuYW50X2lkIjoiMzUxZDEzNmUyNjFkNDk0OGM4Y2ZiOTBjODc4OWEwMTUwOTU4Njg5NzYwYTI4MGIwM2E2ZTkwZWJlMWIxNGIwYSIsImludGVybmFsX3NlY3JldCI6IjQ2OWExNWFjLTNkNDctNGRlYy04ZmJhLTM5ZDVkMWZiOTA3MSJ9.XlUVS0D6hk0nJeVJPgyldFRunAXyxgEfnM2dMKMTOfo",
}).$extends(withAccelerate());

export async function handleUserSignup(c:any){
    interface SignupReqBody{
        username:string;
        email:string;
        password:string;
      }
      
      const signupBody:ZodType<SignupReqBody> = z.object({
        username: z.string().min(4).max(30),
        email:z.string().email(),
        password:z.string().min(6).max(30)
      
      });

      const body: SignupReqBody = await c.req.json();

const {success} = signupBody.safeParse(body);

  if(!success){
    return c.json({
      msg:"Email is incorrect / Password is min length is 6"
    });
  }

  const existingUser = await prisma.user.findFirst({
    where:{
      username:body.username
    }
  });
  if(existingUser){
    return c.json({
      msg: "User already exists"
    })
  }
  const res = await prisma.user.create({
    data:{
      username : body.username,
      email : body.email,
      password : body.password
    }
  });

  const userID = res.id; 


  const token = await Jwt.sign(userID,JWT_SECRET);

  return c.json({
    msg:"Account was created successfully",
    token:token
  });


}

export async function handleUserSignin(c:any){
    interface SigninReqBody {
        email:string;
        password:string;
      }
      
      const signinBody:ZodType<SigninReqBody> = z.object({
        email:z.string().email(),
        password:z.string().min(6).max(30)
      
      });

      const body:SigninReqBody = await c.req.json();
      const {success} = signinBody.safeParse(body);

      if(!success){
        return c.json({
          msg: "Wrong Email or password"
        });
      }
      const doesUserExist = await prisma.user.findFirst({
        where:{
          email:body.email,
          password:body.password
        },
      });
    
      if(!doesUserExist){
        return c.json({
          msg:"User does not exist"
        });
      }
      const userID = doesUserExist.id;
    
      const token = await Jwt.sign(userID,JWT_SECRET);
      return c.json({
        msg:"Login Successfull !",
        token:token,
      });
}

