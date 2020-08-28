import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/', {
    name: 'home',
    action() {
        BlazeLayout.render('MainLayout', {main: "Home"});
        console.log("works");
    }
});

FlowRouter.route('/publicforum', {
    name: 'publicforum',
    action() {
        BlazeLayout.render('MainLayout', {main: "PublicForum"});
        console.log("pf works");
    }
});

FlowRouter.route('/lincolndouglas', {
    name: 'lincolndouglas',
    action() {
        BlazeLayout.render('MainLayout', {main: "LincolnDouglas"});
        console.log("works");
    }
});

FlowRouter.route('/pfteampast', {
    name: 'pfteampast',
    action() {
        BlazeLayout.render('MainLayout', {main: "PFTeamPast"});
        console.log("works");
    }
});

FlowRouter.route('/pfindpast', {
    name: 'pfindpast',
    action() {
        BlazeLayout.render('MainLayout', {main: "PFIndPast"});
        console.log("works");
    }
});

FlowRouter.route('/pfindcurrent', {
    name: 'pfindcurrent',
    action() {
        BlazeLayout.render('MainLayout', {main: "PFIndCurrent"});
        console.log("works");
    }
});

FlowRouter.route('/contact', {
    name: 'contact',
    action() {
        BlazeLayout.render('MainLayout', {main: "Contact"});
        console.log("works");
    }
});