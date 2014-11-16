Template.postTransfer.created = function() {
  Session.set('postSubmitErrors', {});
}

Template.postTransfer.helpers({
  errorMessage: function(field) {
    return Session.get('postSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.postTransfer.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var post = {
      amount_sent: $(e.target).find('[name=amount_sent]').val(),
      amount_received: $(e.target).find('[name=amount_received]').val()
    };
    
    var errors = validatePost(post);
    if (errors.amont_sent || errors.amont_received)
      return Session.set('postSubmitErrors', errors);
    
    Meteor.call('postInsert', post, function(error, result) {
      // display the error to the user and abort
      if (error)
        return throwError(error.reason);
      
      // show this result but route anyway
      if (result.postExists)
        throwError('This link has already been posted');
      
      Router.go('postPage', {_id: result._id});  
    });
  }
});