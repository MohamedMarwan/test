var express = require('express');
var bodyParser = require('body-parser');
var urlEncoded = bodyParser.urlencoded({extended: false});
var jsonParser = bodyParser.json();
var router = express.Router();
var ActionType = require('../models/index.js').ActionType;

var ActionTypeBuilder = function(req, res, next){
	var actionType = {
		action_name: req.body.action_name,
		action_weight: req.body.action_weight,
		publisherId: req.body.publisherId
	}
	req.body.actionType = actionType;
	next();
}
router.route('/')
  .post(jsonParser, ActionTypeBuilder, function(req, res){
  	var actionType = req.body.actionType;
  	ActionType.create(actionType).then(function(createdActionType) {
  		res.status(201).json({status: 'created', actionTypeId: createdActionType.dataValues.id});
  	}, function(err){
  		res.status(404).json({status: 'ERROR', message: 'Something went wrong '+ err});
  	});
  });

router.route('/:id')
  .get(function(req, res) {
    ActionType.find(req.params.id).then(function(actionType) {
      if(!actionType) return res.sendStatus(404);
      res.status(200).json(actionType.dataValues);
    },function(err) {
      res.status(404).json({status: 'ERROR', message: 'Something went wrong ' + err});
    });
  });

router.route('/:id')
  .put(function(req, res) {
    ActionType.find(req.params.id).then(function(oldActionType) {
      if(!oldActionType) return res.sendStatus(404);
      oldActionType.setDataValue('action_name', req.body.action_name);
      oldActionType.setDataValue('action_weight', req.body.action_weight);
      oldActionType.save();
      res.status(200).json({status: 'updated'}); 
    }, function(err) {
      res.status(400).json({status: 'ERROR', message: 'Something went wrong ' + err});
    });
    
  });
router.route('/:id')
  .delete(function(req,res) {
    ActionType.find(req.params.id).then(function(toBeDeletedActionType) {
      if(!toBeDeletedActionType) return res.sendStatus(404);
      toBeDeletedActionType.destroy();
      res.status(200).json({status: 'deleted'});
    }, function(err) {
      res.status(400).json({status: 'ERROR', message: 'Something went wrong ' + err});
    });
    
  });


  module.exports = router;

  