const express = require('express');
const checkPenalized = require('../middleware/checkPenalized');
const checkUrl = require('../middleware/checkUrl');
const memberRoutes = require('./member');
const bookRoutes = require('./book');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../docs/swagger_output.json');

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

const router = express.Router();

router.use(checkPenalized);
router.use(checkUrl);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss:
        '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl: CSS_URL,
}));

router.get('/', (req, res) => {
    res.redirect('/member/index');
});
router.use('/member', memberRoutes);
router.use('/book', bookRoutes);

module.exports = router;