
import Post from "../models/post.model";
import db from "../db";
import { resolve } from "path";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { rejects } from "assert";
import Admin from "../models/admin.model";
import User from "../models/user.model";

interface IPostRepository {
    findById(id: string): Promise<Post | null>;
    findAll(category: string): Promise<Post[]>
    create(post: Post): Promise<Post>
    update(id: string, post:Post): Promise<Post | null>
    delete(id: string): Promise<boolean> 
    toggleLike(postId: string, userId: string,like: boolean): Promise<boolean> 
}


//fonction pour un format de date accepter par mySQL
function formatDateToMySQL(date: Date): string {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

class PostRepository implements IPostRepository {


       

    async toggleLike(postId: string, userId: string, like: boolean): Promise<boolean> {
        console.log(postId, userId,like)
        return new Promise((resolve, reject) => {
            // Vérifier si l'utilisateur a déjà aimé le post
            const checkLikeSql = "SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?";
            db.query<RowDataPacket[]>(checkLikeSql, [postId, userId], (err, data: RowDataPacket[]) => {
                if (err) {
                    return reject(err);
                }
    
                if (data && data.length !== undefined && data.length === 0 && like) {
                    // Liker le post s'il n'est pas déjà liké
                    const incrementLikeSql = "UPDATE posts SET like_count = like_count + 1 WHERE id = ?";
                    db.query<ResultSetHeader>(incrementLikeSql, [postId]);
    
                    const insertLikeSql = "INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)";
                    db.query<ResultSetHeader>(insertLikeSql, [postId, userId], (err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(true); // Succès : post liké
                    });
                } else if (data && data.length !== undefined && data.length > 0 && !like) {
                    // Unliker le post s'il est déjà liké
                    const decrementLikeSql = "UPDATE posts SET like_count = like_count - 1 WHERE id = ?";
                    db.query<ResultSetHeader>(decrementLikeSql, [postId]);
    
                    const deleteLikeSql = "DELETE FROM post_likes WHERE post_id = ? AND user_id = ?";
                    db.query<ResultSetHeader>(deleteLikeSql, [postId, userId], (err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(true); // Succès : post unliké
                    });
                } else {
                    resolve(false); // Aucune opération nécessaire
                }
            });
        });
    }


    async findById(id: string): Promise<Post | null> {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM posts WHERE id = ?";
            db.query<RowDataPacket[]>(sql, [id], (err: URIError| null, data: RowDataPacket[]) => {
                if (err) {
                    console.error("Database error:", err);
                    return reject(err);
                }

                if (data.length > 0) {
                    const post: Post = {
                        id: data[0].id ,
                        title: data[0].title ,
                        content: data[0].content ,
                        category: data[0].category ,
                        image: data[0].image ,
                        created_at: data[0].created_at,
                        updated_at: data[0].updated_at,
                        admin_id: data[0].admin_id,
                        like_count: data[0].like_count 
                    };
                    resolve(post);
                } else {
                    console.log("Post not found:", data);
                    resolve(null);
                }
            });
        });
    }


    async findAll(category?: string): Promise<Post[]> {
        return new Promise((resolve, reject) => {
            const sql = category ? "SELECT * FROM posts WHERE category = ?" : "SELECT * FROM posts"
            const queryValues = category ? [category] : [];
            db.query<RowDataPacket[]>(sql, queryValues ,(err: URIError | null, data: RowDataPacket[]) => {
                if (err) {
                    return reject(err);
                }
                
                // Map the result set to Post array
                const posts: Post[] = data.map(row => ({
                    id: row.id as number,
                    title: row.title as string,
                    content: row.content as string,
                    category: row.category as string,
                    image: row.image as string,
                    created_at: row.created_at as string,
                    updated_at: row.updated_at as string,
                    admin_id: row.admin_id as number,
                    like_count: row.like_count as number
                }));

                resolve(posts);
            });
        });
    }

    async create(post: Post): Promise<Post> {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO posts (`title`, `content`, `category`,`image`, `created_at`, `updated_at`, `admin_id`,`like_count` ) VALUES (?,?,?, ?, ?, ?, ?,?)";
            const values = [post.title, post.content, post.category,post.image,  formatDateToMySQL(new Date(post.created_at)), formatDateToMySQL(new Date(post.updated_at)), post.admin_id, post.like_count];

            db.query<ResultSetHeader>(sql, values, (err, result) => {
                if (err) {
                    return reject(err);
                }

                const newPost: Post = {
                    ...post,
                    id: result.insertId
                };
                resolve(newPost);
            });
        });
    }

    async update(id: string, post: Post): Promise<Post | null> {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE posts SET `title`=?, `content`=?, `category`=?, `image`=?, `updated_at`=?, `admin_id`=? WHERE `id`=?";
            const values = [post.title, post.content, post.category, post.image, formatDateToMySQL(new Date(post.updated_at)), post.admin_id, id];

            db.query<ResultSetHeader>(sql, values, (err, result) => {
                if (err) {
                    return reject(err);
                }

                
                resolve({ ...post,created_at: post.created_at, id: Number(id) });
            });
        });
    }

    async delete(id: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const deleteLikesSQL = "DELETE FROM post_likes WHERE post_id = ?";
            const deletePostSQL = "DELETE FROM posts WHERE id = ?";
            
            db.query<ResultSetHeader>(deleteLikesSQL, [id], (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                db.query<ResultSetHeader>(deletePostSQL, [id], (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (result.affectedRows === 0) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                });
            });
        });
    }
    
}


export default PostRepository