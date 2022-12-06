const express = require("express");
const router = express.Router();

const Post = require('../schemas/post.js');

// 게시글 작성

router.post("/posts", async (req, res) => {
  try{
    const {user, password, title, content} = req.body;
      if (req.body == 0) {
        return res.status(400).json({
          success: false, 
          message: "데이터 형식이 올바르지 않습니다." });
      }
  
    const createdpost = await Post.create({user, password, title, content});
    res.status(200).send({message : "게시글을 생성하였습니다."});
  } catch (error) {
      res.status(400).send({message : "데이터 형식이 올바르지 않습니다."});
  }
});


//게시글 전부 조회

router.get("/posts", async (req, res) => {
  try {
    const existPosts = await Post.find().sort({ createdAt: -1});
    const results = existPosts.map( post => {
      return {
        postId: post._id,
        user: post.user,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
      };
    });

    res.json({
      data: results,
    });
  
  } catch(error){
    res.status(400).json({message: "데이터 형식이 올바르지 않습니다."});
  }
});

// 게시글 번호 조회

router.get("/posts/:postId", async (req, res) => {
  try{
    const {postId} = req.params;
    const existPosts = await Post.findOne({_id: postId});
    if(postId === null){
      return res.status(400).json({
        success: false,
        message: "데이터 형식이 올바르지 않습니다.",
      });
    };

    const result = {
      postId: existPosts._id,
      user: existPosts.user,
      title: existPosts.title,
      content: existPosts.content,
      createdAt: existPosts.createdAt,
    };
    res.json({data: result});
  } catch(error){
      res.status(400).json({message: "데이터 형식이 올바르지 않습니다."});
  }
});

// 게시글 수정

router.put("/posts/:postId", async (req, res) => {
  try{
    const {postId} = req.params;
    const {password, title, content} = req.body;
    const existPosts = await Post.findOne({_id: postId});
    if(existPosts === null){
      return res.status(400).json({message: "게시글 조회에 실패했습니다."});
    }
    await Post.updateOne(
      {_id: postId},
      {$set: {password, title, content}},
    )
    return res.status(200).json({message: "게시글을 수정하였습니다."});
  } catch(error){
      return res.status(400).json({message: "데이터 형식이 올바르지 않습니다."})
  }
});

// 게시글 삭제

router.delete("/posts/:postId", async (req, res) => {
  try{
    const {postId} = req.params;
    const {password} = req.body;

    const existPosts = await Post.findOne({_id: postId});
    if(existPosts === null){
      return res.status(400).json({message: "댓글 조회에 실패했습니다."});
    }
    if(existPosts.password !== password){
      return res.status(400).json({message: "비밀번호가 다릅니다."});
    }

    await Post.deleteOne({_id: postId});
    return res.status(200).json({message: "게시글을 삭제하였습니다."});

  } catch(error){
      return res.status(400).json({message : "데이터 형식이 올바르지 않습니다."});
  }
});



module.exports = router;