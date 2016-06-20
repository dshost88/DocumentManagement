module.exports = (function () {
  'use strict';

  var responsehelper  = require('./response_helper'),
    validateDoc = require('./validate_documents');

  var updateRoles = function (Roles, roles, res, req, Doc, index) {
    Roles.find({'title': roles}, function(err, role) {
      parseRole(err, role, res, req, Doc, roles, index);
    });

  };

  function parseRole(err, role, res, req, Doc, roles, index) {
    err ? responsehelper.response(res, 409, {'error': err.message})
    : findDoc(Doc, req, res, roles, role, index);

  }

  function findDoc(Doc, req, res, roles, role, index) {
    if(!role){
      responsehelper.response(res, 409, { 'error': roles + 'does not extist'} );
      return '';
    }

    var updates = validateDoc.roleUpdate(req);
    Doc.findOneAndUpdate({'title': req.params.id},
     { $set: updates[0], $push: { 'access' : roles } },
     { new: true, runValidators: true }, function(err, docs) {
      updateDoc(err, docs, res, index);
     });
  }

  function updateDoc(err, docs, res, index) {
    err ? responsehelper.response(res, 409, err) :
    (req.body.role.length === (index + 1)) ?
    responsehelper.response(res, 200, {'success' : docs}) : '';

  }

  return {
    updateRoles: updateRoles
  };

})();