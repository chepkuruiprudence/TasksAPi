import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const app = express();
app.use(express.json())

app.get ('/', (_req, res) => {
  res.send('<h1>Welcome to Tasks manager APi</h1>');
});

//Create Task
app.post("/tasks", async (req, res) => {
 try{
  console.log(req.body);
  const{title,description } = req.body;
  const newTask = await prisma.task.create({
   data: {title, description},
  });
  res.status(200).json(newTask);
 } catch (error) {
  res
  .status(500)
  .json({message:"An error occured. Please try again later"});
 }
});

//Get tasks
app.get("/tasks", async (_req, res) => {
 try{
  const tasks = await prisma.task.findMany({
   where: {
    isCompleted: false,
   },
  });
  res.status(200).json(tasks);
 } catch (error) {
  res
  .status(500)
  .json({message:"Something went wrong"});
 }
});

//Get 1 Task
app.get("/tasks/:id", async (req, res) => {
 try {
   const task = await prisma.task.findUnique({
     where: {
       id: req.params.id,
     },
   });
   res.status(200).json(task);
 } catch (error) {
   res.status(404).json({ message: "No task" });
 }
});

//Update Task
app.put("/tasks/:id", async (req, res) => {
 try {
  console.log(req.body);
  console.log("Req Params:", req.params);

  const{ id } = req.params;
   const updatedTask = await prisma.task.update({
     where: {
       id: req.params.id,
     },
     data: {
       title: req.body.title,
       isCompleted: req.body.isCompleted,
       description: req.body.description,
     },
   });
   res.status(200).json(updatedTask);
 } catch (error) {
   res.status(500).json({ message: "Error updating task" });
 }
});

//Delete Task
app.delete("/tasks/:id", async (req, res) => {
 try {
   console.log(req.params);
   const { id } = req.params;
   console.log(id);
   await prisma.task.delete({
     where: {
      id: req.params.id,
     },
   });
   res.status(200).json({ message: "Task deleted successfully." });
 } catch (error) {
   console.log(error);
   res
     .status(500)
     .json({ message: "Error deleting task, please try again later." });
 }
});

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
 console.log(`Server is running on port ${PORT}`);
});


