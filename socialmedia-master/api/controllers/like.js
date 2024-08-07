import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = async (req, res) => {
  try {
    const q = "SELECT userId FROM likes WHERE postId = ?";
    const data = await query(q, [req.query.postId]);
    return res.status(200).json(data.map((like) => like.userId));
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const addLike = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = await verifyToken(token);

    const q = "INSERT INTO likes (`userId`,`postId`) VALUES (?)";
    const values = [userInfo.id, req.body.postId];

    await query(q, [values]);
    return res.status(200).json("Post has been liked.");
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const deleteLike = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = await verifyToken(token);

    const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";
    await query(q, [userInfo.id, req.query.postId]);
    return res.status(200).json("Post has been disliked.");
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Helper function to promisify db.query
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// Helper function to promisify jwt.verify
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) {
        reject(err);
      } else {
        resolve(userInfo);
      }
    });
  });
};
