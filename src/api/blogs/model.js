import mongoose from "mongoose"

const { Schema, model } = mongoose

const blogsSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String },
    readTime: {
      value: { type: Number },
      unit: { type: String },
    },
    author: {
        name: { type: String, required:true },
        avatar: { type: String },
      },
      comments:[{rate: Number, text: String}]
  },
  {
    timestamps: true, 
  }
)

export default model("Blog", blogsSchema) 