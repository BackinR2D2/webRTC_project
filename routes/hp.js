const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');

router.get('/homepage', (_, res) => {
    const id = uuidv4();
    res.status(201).send(id);
})

module.exports = router;