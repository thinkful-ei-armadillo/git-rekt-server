const express = require('express');
const QueueService = require('./queueService');
const {requireAuth} = require('../../middleware/jwt-auth');
const parser = express.json();

const queueRouter = express.Router();

queueRouter
  .route('/')
  .get( async (req, res, next) => {
    try{
      const pointer = await QueueService.getPointers(req.app.get('db'));
      const queueList = [];
      const mentorList = await QueueService.getAll(req.app.get('db'));
      const currentlyBeingHelped = mentorList.filter(list => list.dequeue === true && list.completed === false);
      
      if(pointer.head !== null)
        queueList = list.filter(listItem => listItem.id >= pointer.head);

      res.json({
        queueList,
        currentlyBeingHelped
      });

    } catch (error) {
      next(error);
    }

  })
  .post(parser, requireAuth,async (req,res,next)=>{
    try{
      const pointer = await QueueService.getPointers(req.app.get('db'));
      const {user_name} = req.user;
      const {description} = req.body;
      let newQueueData = { description, user_name };

      if(!description)
        return res.status(400).json({
          error: `Missing description in request body`
        })
  
      await QueueService.enqueue(req.app.get('db'), newQueueData)
       .then(res => newQueueData = res)

      if (pointer.head === null)
        await QueueService.updateBothPointers(req.app.get('db'), newQueueData.id)
      else {
        await QueueService.updateTailPointer(req.app.get('db'), newQueueData.id);
        await QueueService.updateQueue(req.app.get('db'), pointer.tail, newQueueData.id);
      } 
      res.json({
        studentName: req.user.name
      })

    } catch (error) {
      next(error);
    }
  })
  .patch(parser, requireAuth ,async (req,res,next)=>{
    try {
      const { title, user_name }  = req.user;

      if(title !== 'mentor'){
        return res.status(400).json({
          error: `Sorry Only mentors can update queue`
        });
      }

      const pointer = await QueueService.getPointers(req.app.get('db'));
      if(pointer.head === null)
        return res.status(204)
      const current = await QueueService.getById(req.app.get('db'), pointer.head);
      const currentDequeueUpdate = {mentor_user_name: user_name, dequeue: true, next: null}
      
      await QueueService.updateHeadPointer(req.app.get('db'), current.next);
      await QueueService.dequeue(req.app.get('db'), pointer.head, currentDequeueUpdate);
      if(current.next === null){
        await QueueService.updateTailPointer(req.app.get('db'), current.next);
      }

      res.status(204)
 
    } catch (error){
      next(error);
    }
  })

queueRouter
  .route('/:dequeuedId')
  .all(requireAuth)
  .patch(async (req,res,next)=>{
    try{
      console.log(req.user)
      console.log('id', req.params.dequeueId)
    } catch(error) {
      next(error)
    }
  })

module.exports = queueRouter;