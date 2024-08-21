"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
//fonction pour un format de date accepter par mySQL
function formatDateToMySQL(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}
class PostRepository {
    toggleLike(postId, userId, like) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(postId, userId, like);
            return new Promise((resolve, reject) => {
                // Vérifier si l'utilisateur a déjà aimé le post
                const checkLikeSql = "SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?";
                db_1.default.query(checkLikeSql, [postId, userId], (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    if (data && data.length !== undefined && data.length === 0 && like) {
                        // Liker le post s'il n'est pas déjà liké
                        const incrementLikeSql = "UPDATE posts SET like_count = like_count + 1 WHERE id = ?";
                        db_1.default.query(incrementLikeSql, [postId]);
                        const insertLikeSql = "INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)";
                        db_1.default.query(insertLikeSql, [postId, userId], (err) => {
                            if (err) {
                                return reject(err);
                            }
                            resolve(true); // Succès : post liké
                        });
                    }
                    else if (data && data.length !== undefined && data.length > 0 && !like) {
                        // Unliker le post s'il est déjà liké
                        const decrementLikeSql = "UPDATE posts SET like_count = like_count - 1 WHERE id = ?";
                        db_1.default.query(decrementLikeSql, [postId]);
                        const deleteLikeSql = "DELETE FROM post_likes WHERE post_id = ? AND user_id = ?";
                        db_1.default.query(deleteLikeSql, [postId, userId], (err) => {
                            if (err) {
                                return reject(err);
                            }
                            resolve(true); // Succès : post unliké
                        });
                    }
                    else {
                        resolve(false); // Aucune opération nécessaire
                    }
                });
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const sql = "SELECT * FROM posts WHERE id = ?";
                db_1.default.query(sql, [id], (err, data) => {
                    if (err) {
                        console.error("Database error:", err);
                        return reject(err);
                    }
                    if (data.length > 0) {
                        const post = {
                            id: data[0].id,
                            title: data[0].title,
                            content: data[0].content,
                            category: data[0].category,
                            image: data[0].image,
                            created_at: data[0].created_at,
                            updated_at: data[0].updated_at,
                            admin_id: data[0].admin_id,
                            like_count: data[0].like_count
                        };
                        resolve(post);
                    }
                    else {
                        console.log("Post not found:", data);
                        resolve(null);
                    }
                });
            });
        });
    }
    findAll(category) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const sql = category ? "SELECT * FROM posts WHERE category = ?" : "SELECT * FROM posts";
                const queryValues = category ? [category] : [];
                db_1.default.query(sql, queryValues, (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    // Map the result set to Post array
                    const posts = data.map(row => ({
                        id: row.id,
                        title: row.title,
                        content: row.content,
                        category: row.category,
                        image: row.image,
                        created_at: row.created_at,
                        updated_at: row.updated_at,
                        admin_id: row.admin_id,
                        like_count: row.like_count
                    }));
                    resolve(posts);
                });
            });
        });
    }
    create(post) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const sql = "INSERT INTO posts (`title`, `content`, `category`,`image`, `created_at`, `updated_at`, `admin_id`,`like_count` ) VALUES (?,?,?, ?, ?, ?, ?,?)";
                const values = [post.title, post.content, post.category, post.image, formatDateToMySQL(new Date(post.created_at)), formatDateToMySQL(new Date(post.updated_at)), post.admin_id, post.like_count];
                db_1.default.query(sql, values, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    const newPost = Object.assign(Object.assign({}, post), { id: result.insertId });
                    resolve(newPost);
                });
            });
        });
    }
    update(id, post) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const sql = "UPDATE posts SET `title`=?, `content`=?, `category`=?, `image`=?, `updated_at`=?, `admin_id`=? WHERE `id`=?";
                const values = [post.title, post.content, post.category, post.image, formatDateToMySQL(new Date(post.updated_at)), post.admin_id, id];
                db_1.default.query(sql, values, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(Object.assign(Object.assign({}, post), { created_at: post.created_at, id: Number(id) }));
                });
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const deleteLikesSQL = "DELETE FROM post_likes WHERE post_id = ?";
                const deletePostSQL = "DELETE FROM posts WHERE id = ?";
                db_1.default.query(deleteLikesSQL, [id], (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    db_1.default.query(deletePostSQL, [id], (err, result) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (result.affectedRows === 0) {
                            resolve(false);
                        }
                        else {
                            resolve(true);
                        }
                    });
                });
            });
        });
    }
}
exports.default = PostRepository;
//# sourceMappingURL=post.repository.js.map