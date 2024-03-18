const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
    banner1: { type: String, },
    banner1Location: { type: String, },
    banner2: { type: String, },
    banner2Location: { type: String, },
    card_title: { type: String, },
    card_main_title: { type: String, },
    card_content: { type: String, },
    Link: { type: String, },
    homePageTitleOne: { type: String, },
    homePageTitleTwo: { type: String, },
    homePageDescription: { type: String, },
    homageImageOne: { type: String, },
    homageImageOneLocation: { type: String, },
    homePageImageTwo: { type: String, },
    homePageImageTwoLocation: { type: String, },
});

const Dashboard = mongoose.model('dashboard', dashboardSchema);

module.exports = Dashboard;
