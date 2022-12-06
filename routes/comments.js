const express = require("express");
const router = express.Router();

const Post = require('../schemas/post.js');
const Comment = require('../schemas/comment.js');

// 댓글 작성
router.post("/comments/:postId", async (req, res) => {
    try{
        const {postId} = req.params;
        const existPosts = await Post.findOne({_id: postId});
        const {user, password, content} = req.body;
        if(existPosts === null) {
            return res.status(400).json({
                success: false,
                message: "게시글을 찾을 수 없습니다.",
            });
        }
        if(content.length === 0) {
            return res.status(400).json({
                success: false,
                message: "댓글 내용을 입력해주세요",
            })
        }
        
        const createdcomment = await Comment.create({user, password, content, postId});
        res.status(200).send({message : "댓글을 생성하였습니다."});

    } catch(error){
        return res.status(400).json({message: "데이터 형식이 올바르지 않습니다"});
    }
});
  
//글 목록에 맞는 댓글 조회
router.get("/comments/:postId", async (req, res) => {
    try{
        const existComments = await Comment.find();
        const results = existComments.map(comment => {
            return {
                postId: comment._id,
                user: comment.user,
                content: comment.content,
                createdAt: comment.createdAt,
            };
        });
        res.json({
            data: results,
        })
    } catch (error) {
        return res.status(400).json({message: "데이터 형식이 올바르지 않습니다."});
    }
});
  
// 댓글 수정
router.put("/comments/:commentId", async (req, res) => {
    try{
        const {commentId} = req.params;
        const {password, content} = req.body;

        const existComments = await Comment.findOne({_id: commentId});

        if(existComments.password !== password) {
            return res.status(400).json({message: "비밀번호가 다릅니다."});
        }
        if(existComments === null) {
            return res.status(400).json({message: "댓글 조회에 실패했습니다."});
        }
        if(existComments.length === 0) {
            return res.status(400).json({message: "댓글 내용을 입력해주세요."});
        }

        await Comment.updateOne(
            {_id: commentId},
            {$set: {content}},
        )
        res.json({message: "게시글을 수정하였습니다."});
        } catch (error) {
        return res.status(400).json({message: "데이터 형식이 올바르지 않습니다."});
    }
});

// 댓글 삭제
router.delete("/comments/:commentId", async (req, res) => {
    try{
        const {commentId} = req.params;
        const {password} = req.body;
        const existComments = await Comment.findOne({_id: commentId});
        if(existComments === null){
            return res.status(400).json({message: "댓글 조회에 실패하였습니다."});
        }
        if(existComments.password !== password) {
            return res.status(400).json({message: "비밀번호가 다릅니다."});
        }

        await existComments.deleteOne({password: password});
        return res.status(200).json({message: "댓글을 삭제하였습니다."});
    } catch(error){
        return res.status(400).json({message: "데이터 형식이 올바르지 않습니다."});
    }
});

module.exports = router;