import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import { DefaultDeserializer } from "v8";

// export const getPosts = async (req, res) => {
//   try {
//     const userId = req.query.userId;
//     const token = req.cookies.accessToken;

//     if (!token) {
//       return res.status(401).json("Not logged in!");
//     }

//     const userInfo = await jwt.verify(token, "secretkey");

//     const q =
//       userId !== "undefined"
//         ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
//         : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
//     LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
//     ORDER BY p.createdAt DESC`;

//     const values =
//       userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

//     const [data] = await db.promise().query(q, values);

//     return res.status(200).json(data);
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// };

export const getPosts = async (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  try {
    if (!token) {
      return res.status(401).json("Not logged in!");
    }
    const q = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)`;
    const [rows] = await db.promise().query(q);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const addPost = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = await new Promise((resolve, reject) => {
      jwt.verify(token, "secretkey", (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });

    const q =
      "INSERT INTO posts(`desc`, `img`, `createdAt`, `userId`) VALUES (?, ?, ?, ?)";
    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    const [data] = await db.promise().query(q, values);

    return res.status(200).json("Post has been created.");
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = await new Promise((resolve, reject) => {
      jwt.verify(token, "secretkey", (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });

    const q = "DELETE FROM posts WHERE `id`=? AND `userId` = ?";
    const [data] = await db.promise().query(q, [req.params.id, userInfo.id]);

    if (data.affectedRows > 0) {
      return res.status(200).json("Post has been deleted.");
    } else {
      return res.status(403).json("You can delete only your post");
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json(error);
  }
};