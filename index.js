import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json())

app.get ('/', (_req, res) => {
  res.send('<h1>Welcome to Tasks manager APi page</h1>');
});

//Create Task
app.post('/tasks', (req, res) => {
 const { title, description } = req.body;
 prisma.task.create({ 
  data: {
    title, description
    } 
   })
   .then(task => res.status(201).json(task))
   .catch(() => res.status(500).json({
     message: 'Error creating tasks. Please try again later'
     })
    );
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
app.get("/tasks/:id", (req, res) => {
 prisma.task.findUnique({
   where: { id: req.params.id },
 })
 .then(task => {
   if (task) {
     res.json(task);
   } else {
     res.status(404).json({ message: "Task not found" });
   }
 })
 .catch(() => res.status(500).json({ message: "coulnt fetch task" }));
});

//Update Task
app.put("/tasks/:id", (req, res) => {
 const { title, description, isCompleted } = req.body;

 prisma.task.update({
   where: { 
    id: req.params.id },
   data: { title, description, isCompleted },
 })
 .then(updatedTask => res.json(updatedTask))
 .catch(() => res.status(500).json({ message: "Error updating task" }));
});


//Delete Task
app.delete('/tasks/:id', async (req, res) => {
 await prisma.task.delete({
   where: { 
    id: req.params.id 
   },
 });
 res.json({ message: 'Task deleted.' });
});

app.listen(3000, () => {
 console.log(`Server is running on port ${PORT}`);
});


