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
const post_repository_1 = __importDefault(require("../repository/post.repository"));
class PostController {
    constructor() {
        this.findById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.id;
                const post = yield this.PostRepository.findById(postId);
                res.status(200).json(post);
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
        this.findAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const category = req.query.category;
                const posts = yield this.PostRepository.findAll(category);
                res.status(200).json(posts);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const post = {
                    title: req.body.title,
                    content: req.body.content,
                    category: req.body.category,
                    image: req.body.image,
                    created_at: new Date().toISOString(), // Assurez-vous que la date est bien formatée
                    updated_at: new Date().toISOString(), // Ajoutez updated_at si nécessaire
                    admin_id: req.body.admin_id, // Assurez-vous que admin_id est fourni
                    like_count: 0 // Initialiser like_count à 0 ou à une valeur par défaut
                };
                const newPost = yield this.PostRepository.create(post);
                res.status(201).json(newPost);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const post = {
                    title: req.body.title,
                    content: req.body.content,
                    category: req.body.category,
                    image: req.body.image,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(), // Ajoutez updated_at si nécessaire
                    admin_id: req.body.admin_id, // Assurez-vous que admin_id est fourni
                };
                const updatedPost = yield this.PostRepository.update(id, post);
                if (updatedPost) {
                    res.status(200).json(updatedPost);
                }
                else {
                    res.status(404).json({ message: "Post not found" });
                }
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const success = yield this.PostRepository.delete(id);
                if (success) {
                    res.status(200).json({ message: 'Post deleted successfully' });
                }
                else {
                    res.status(404).json({ message: 'Post not found or not authorized' });
                }
            }
            catch (error) {
                res.status(500).json({ message: error.message });
                console.error("Erreur lors de la suppression du post:", error);
            }
        });
        this.toggleLike = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const postId = req.params.id;
            const userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.toString();
            const like = req.body.like;
            try {
                if (typeof userId === 'string') {
                    // Utilisation sécurisée de userId comme string
                    const success = yield this.PostRepository.toggleLike(postId, userId, like);
                    console.log(like);
                    console.log(userId);
                    if (success) {
                        res.status(200).json({ message: 'Toggle like/unlike successful' });
                    }
                    else {
                        res.status(400).json({ message: 'Toggle like/unlike failed' });
                        console.log(like);
                    }
                }
                else {
                    // Gérer le cas où userId est undefined (par exemple, envoyer une réponse d'erreur)
                    res.status(400).json({ message: 'User ID not found or invalid' });
                }
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
        this.PostRepository = new post_repository_1.default();
        this.findById = this.findById.bind(this);
        this.findAll = this.findAll.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.toggleLike = this.toggleLike.bind(this);
    }
}
exports.default = PostController;
//# sourceMappingURL=post.controller.js.map