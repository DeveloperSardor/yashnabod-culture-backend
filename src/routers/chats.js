import { Router } from "express";
import { ChatContr } from '../controllers/chats.js'

const router = Router();

router.post('/', ChatContr.createChat);
router.post('/connect-admin', ChatContr.connectWithAdmin);
router.get('/', ChatContr.GetChat);


export default router;