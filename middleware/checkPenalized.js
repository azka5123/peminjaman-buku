const { Member } = require('../models');
const moment = require('moment'); // Import moment for date manipulation

async function checkPenalized(req, res,next) {
    try {
        const members = await Member.findAll();
        for (const member of members) {
            if (moment(member.penaltyTime).isBefore(moment())) {
                await member.update({
                    status: 'Active',
                    penaltyTime: null
                });
            }
        }
        next();
    } catch (err) {
        res.status(500).send(err.message || 'Failed to update member statuses.');
    }
}

module.exports = checkPenalized;
