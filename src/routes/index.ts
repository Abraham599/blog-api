import { PrismaClient } from '@prisma/client/edge';
import { Hono } from 'hono';
import { withAccelerate } from '@prisma/extension-accelerate'
import { authMiddleware } from '../auth';
import {  handleUserSignin, handleUserSignup} from './user';
import { deleteUserPost, getAllUserPost, getUserPost, postUserPost, updateUserPost } from './post';

export const router = new Hono();

const prisma = new PrismaClient({
    datasourceUrl: "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNWI5YmU0ODAtYWQ2Zi00OTEwLThmZGItMGVmNWI4ZWI4M2UwIiwidGVuYW50X2lkIjoiMzUxZDEzNmUyNjFkNDk0OGM4Y2ZiOTBjODc4OWEwMTUwOTU4Njg5NzYwYTI4MGIwM2E2ZTkwZWJlMWIxNGIwYSIsImludGVybmFsX3NlY3JldCI6IjQ2OWExNWFjLTNkNDctNGRlYy04ZmJhLTM5ZDVkMWZiOTA3MSJ9.XlUVS0D6hk0nJeVJPgyldFRunAXyxgEfnM2dMKMTOfo",
}).$extends(withAccelerate());

router.post("/signup",handleUserSignup);
router.post("/signin", handleUserSignin);
router.get("/posts",authMiddleware,getAllUserPost);
router.post("/posts",authMiddleware,postUserPost);
router.get("/posts/:id",authMiddleware,getUserPost);
router.put("/posts/:id",authMiddleware,updateUserPost);
router.delete("/posts/:id",authMiddleware,deleteUserPost);