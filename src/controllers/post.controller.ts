
import PostRepository from "../repository/post.repository"
import { Request, Response } from 'express';
import Post from "../models/post.model";
import { AdminRequest } from "../middlewares/auth.middleware";
import { AuthRequest } from "../middlewares/userAuth.middleware";
import Admin from "../models/admin.model";
import User from "../models/user.model";
class PostController{
    private PostRepository:  PostRepository

    constructor(){
      this.PostRepository =  new PostRepository();

    this.findById = this.findById.bind(this)
    this.findAll = this.findAll.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
    this.toggleLike = this.toggleLike.bind(this)
    }


    findById  = async (req: Request, res: Response): Promise<void> => {
            try{

                const postId = req.params.id;
                const post = await this.PostRepository.findById(postId)
                res.status(200).json(post);
            }catch (error: any) {
                res.status(404).json({ message: error.message });
            }


    }

    findAll =  async (req: Request, res: Response): Promise<void> => {
        try{
            const category = req.query.category as string
            const posts = await this.PostRepository.findAll(category)
            res.status(200).json(posts);
        
        }catch(err: any){
            res.status(500).json({ message: err.message });
        }
    }

    create = async (req: Request, res: Response): Promise<void> =>{
        
        
        try{
            
            const post: Post = {
                title: req.body.title,
                content: req.body.content,
                category: req.body.category,
                image: req.body.image,
                created_at: new Date().toISOString(), // Assurez-vous que la date est bien formatée
                updated_at: new Date().toISOString(), // Ajoutez updated_at si nécessaire
                admin_id: req.body.admin_id, // Assurez-vous que admin_id est fourni
                like_count: 0 // Initialiser like_count à 0 ou à une valeur par défaut
            };
            const newPost = await this.PostRepository.create(post)
            res.status(201).json(newPost);
        }catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    update = async (req: Request, res: Response): Promise<void> =>{
        try{
            const id = req.params.id
            const post: Post = {
                title: req.body.title,
                content: req.body.content,
                category: req.body.category,
                image: req.body.image,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(), // Ajoutez updated_at si nécessaire
                admin_id: req.body.admin_id, // Assurez-vous que admin_id est fourni
              
            };

            const updatedPost = await this.PostRepository.update(id, post)
            if (updatedPost) {
                res.status(200).json(updatedPost);
            } else {
                res.status(404).json({ message: "Post not found" });
            }
        }catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    delete = async (req: Request, res: Response): Promise<void> => {
       
             
            
            try {  
                
        
                const id = req.params.id;   
                const success = await this.PostRepository.delete(id);
                if (success) {
                    res.status(200).json({ message: 'Post deleted successfully' });
                } else {
                    res.status(404).json({ message: 'Post not found or not authorized' });
                }
        } catch (error: Error | any) {
            res.status(500).json({ message: error.message });
            
            
            console.error("Erreur lors de la suppression du post:", error);
        
    }
    };

    toggleLike = async (req: AuthRequest, res: Response): Promise<void> => {
        const postId = req.params.id
        const userId = req.user?.id?.toString();
        const like = req.body.like;
       
        try {
            if (typeof userId === 'string') {
                // Utilisation sécurisée de userId comme string
                const success = await this.PostRepository.toggleLike(postId, userId, like);
                console.log(like)
                console.log(userId)
                if (success) {
                    res.status(200).json({ message: 'Toggle like/unlike successful' });
                } else {
                    res.status(400).json({ message: 'Toggle like/unlike failed' });
                    console.log(like)
                }
            } else {
                // Gérer le cas où userId est undefined (par exemple, envoyer une réponse d'erreur)
                res.status(400).json({ message: 'User ID not found or invalid' });
            }
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };
}



export default PostController;
