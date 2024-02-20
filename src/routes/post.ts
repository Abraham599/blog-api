import { PrismaClient } from '@prisma/client/edge';
import { Jwt } from 'hono/utils/jwt';
import { ZodType, string, z } from 'zod';
import { withAccelerate } from '@prisma/extension-accelerate'

const JWT_SECRET = "0e0a22d5c7c6ae862cf6558ed1be647ee2c57eef93900d0d30130e44e728c434";
const prisma = new PrismaClient({
    datasourceUrl: "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNWI5YmU0ODAtYWQ2Zi00OTEwLThmZGItMGVmNWI4ZWI4M2UwIiwidGVuYW50X2lkIjoiMzUxZDEzNmUyNjFkNDk0OGM4Y2ZiOTBjODc4OWEwMTUwOTU4Njg5NzYwYTI4MGIwM2E2ZTkwZWJlMWIxNGIwYSIsImludGVybmFsX3NlY3JldCI6IjQ2OWExNWFjLTNkNDctNGRlYy04ZmJhLTM5ZDVkMWZiOTA3MSJ9.XlUVS0D6hk0nJeVJPgyldFRunAXyxgEfnM2dMKMTOfo",
}).$extends(withAccelerate());


export async function getAllUserPost(c:any){
    const userID = await c.req.userID;
  const doesUserExist = await prisma.user.findUnique({
    where:{
      id:userID
    }
  });

  if(!doesUserExist){
    return c.json({
      msg:"User does not exist"
    });
  }
  const res = await prisma.post.findMany({
    where:{
      userID:userID
    }
  });

  return c.json({
    posts:res
  });

}


interface BlogFormat{
    title:string;
    content:string;
    tags:string[];
    
}

export async function postUserPost(c:any){
    const userID = await c.req.userID;
  const doesUserExist = await prisma.user.findUnique({
    where:{
      id:userID
    }
  });

  if(!doesUserExist){
    return c.json({
      msg:"User does not exist"
    });
  } 
  const body:BlogFormat = await c.req.json();
  if(!body.title && !body.content){
    return c.json({
      msg:"Please complete the post ! (title & content)"
    })
  }
  const res = await prisma.post.create({
    data:{
      title:body.title,
      content:body.content,
      tags:{
        set:body.tags,
      },
      userID:c.req.userID
    }
  });
  return c.json({
    msg:"Your post was published successfully !",
    post: res
  });
}

export async function getUserPost(c:any){
    const userID = await c.req.userID;
  const doesUserExist = await prisma.user.findUnique({
    where:{
      id:userID
    }
  });

  if(!doesUserExist){
    return c.json({
      msg:"User does not exist"
    });
  } 

  const id:number = Number(c.req.param("id"));

  const res = await prisma.post.findUnique({
    where:{
      id:id,
      userID:userID
    }
  });

  if(!res){
    return c.json({
      msg:"Post does not exist for the user"
    });
  }
 
  return c.json({
    post:res
  });

}


export async function updateUserPost(c:any){
    const userID = await c.req.userID;
  const doesUserExist = await prisma.user.findUnique({
    where:{
      id:userID
    }
  });

  if(!doesUserExist){
    return c.json({
      msg:"User does not exist"
    });
  } 

  const id:number = Number(c.req.param("id"));

  let res = await prisma.post.findUnique({
    where:{
      id:id,
      userID:userID
    }
  });

  if(!res){
    return c.json({
      msg:"Post does not exist for the user"
    });
  }
  const body:BlogFormat = await c.req.json();
  res = await prisma.post.update({
    where:{
      id:id,
      userID:userID
    },
    data:{
      title:body.title,
      content:body.content,
      tags:{
        set:body.tags,
      }
    }
  });
  return c.json({
    msg:"Post updated !",
    post:res
  });


}

export async function deleteUserPost(c:any){
    const userID = await c.req.userID;
  const doesUserExist = await prisma.user.findUnique({
    where:{
      id:userID
    }
  });

  if(!doesUserExist){
    return c.json({
      msg:"User does not exist"
    });
  } 

  const id:number = Number(c.req.param("id"));

  let res = await prisma.post.findUnique({
    where:{
      id:id,
      userID:userID
    }
  });

  if(!res){
    return c.json({
      msg:"Post does not exist for the user"
    });
  }
  res = await prisma.post.delete({
    where:{
      id:id,
      userID:userID
    },

  });
  return c.json({
    msg:"Post deleted !",
    post:res
  });

}

