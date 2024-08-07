import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";


export const getComments = async (req, res) => {
  try {
   
    const [rows] = await db.promise().query(`
    SELECT c.*, u.id AS userId, name, profilePic 
    FROM comments AS c 
    JOIN users AS u ON (u.id = c.userId)
    WHERE c.postId = ? 
    ORDER BY c.createdAt DESC;
    
    `, [req.query.postId]);

    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};


export const addComment = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = await new Promise((resolve, reject) => {
      jwt.verify(token, "secretkey", (err, decoded) => {
        if (err) reject("Token is not valid!");
        resolve(decoded);
      });
    });
    if (!req.body.postId) {
      return res.status(400).json("postId is required for adding a comment.");
    }
    const q = "INSERT INTO comments(`desc`, `userId`, `postId`) VALUES (?, ?, ?)";
    const values = [req.body.desc, userInfo.id, req.body.postId];

    
    const [data] = await db.promise().query(q, values);

    return res.status(200).json("Comment has been created.");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};


export const deleteComment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const commentId = req.params.id;
    const q = "DELETE FROM comments WHERE `id` = ? AND `userId` = ?";

    db.query(q, [commentId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.json("Comment has been deleted!");
      return res.status(403).json("You can delete only your comment!");
    });
  });
};