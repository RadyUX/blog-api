import { Router } from 'express';
import PostController from '../controllers/post.controller';
import { adminAuth } from '../middlewares/auth.middleware';
import { auth } from '../middlewares/userAuth.middleware';

const postrouter = Router();
const postController = new PostController()

postrouter.get('/post/:id', postController.findById);
postrouter.get('/posts', postController.findAll)
postrouter.post('/posts/create',adminAuth, postController.create)
postrouter.put('/posts/update/:id',adminAuth, postController.update)
postrouter.delete('/posts/delete/:id', adminAuth, postController.delete)
postrouter.post('/like/:id', auth, postController.toggleLike)
export default  postrouter ;
