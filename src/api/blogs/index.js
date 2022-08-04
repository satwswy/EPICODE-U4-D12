import express from "express"
import createHttpError from "http-errors"
import BlogsModel from "./model.js"
import q2m from 'query-to-mongo'

const blogsRouter = express.Router()

blogsRouter.post("/", async (req, res, next) => {
  try {
    const newBlog = new BlogsModel(req.body) 
    const { _id } = await newBlog.save()

    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

blogsRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query)
    console.log("QUERY: ", req.query)
    console.log("MONGO-QUERY: ", mongoQuery)

    const total = await BlogsModel.countDocuments(mongoQuery.criteria)
    const blogs = await BlogsModel.find(mongoQuery.criteria , mongoQuery.options.fields)
    .limit(mongoQuery.options.limit)
    .skip(mongoQuery.options.skip)
    .sort(mongoQuery.options.sort)
    res.send({ links: mongoQuery.links("http://localhost:3005/blogs", total), total, totalPages: Math.ceil(total / mongoQuery.options.limit), blogs })
  } catch (error) {
    next(error)
  }
})

blogsRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blog = await BlogsModel.findById(req.params.blogId)
    if (blog) {
      res.send(blog)
    } else {
      next(createHttpError(404, `Blog with id ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.put("/:blogId", async (req, res, next) => {
  try {
    const updatedBlog = await BlogsModel.findByIdAndUpdate(
      req.params.blogId, 
      req.body, 
      { new: true, runValidators: true } 
    )

    if (updatedBlog) {
      res.send(updatedBlog)
    } else {
      next(createHttpError(404, `Blog with id ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const deletedBlog = await BlogsModel.findByIdAndDelete(req.params.blogId)
    if (deletedBlog) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `Blog with id ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.post("/:blogId/comments", async (req,res,next)=>{
  try {
    
    const updatedBlog = await BlogsModel.findByIdAndUpdate(
      req.params.blogId, 
      { $push: { comments: req.body } }, 
      { new: true, runValidators: true } 
    )
    if (updatedBlog) {
      res.send(updatedBlog)
    } else {
      next(createHttpError(404, `Blog with id ${req.params.blogId} not found!`))
    }

  } catch (error) {
    next(error)
  }
})

blogsRouter.get("/:blogId/comments", async (req,res,next)=>{
  try {
    const blog = await BlogsModel.findById(req.params.blogId)
    if(blog){
      res.send(blog.comments)
    }
    else{
      next(createHttpError(404, `Blog with id ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next (error)
  }
})

export default blogsRouter
