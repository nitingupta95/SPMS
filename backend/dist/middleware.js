"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'hi_there_my_name_is_nitin_gupta';
function authenticateToken(req, res, next) {
    const token = req.headers['token'];
    if (!token) {
        res.status(401).json({ message: 'Token missing' });
        return; // ✅ just return here, don't return res.status(...)
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    }
    catch (err) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
}
