if (Meteor.isClient) {

  Template.timer.onCreated(function() {
    Session.setDefault('now', Date.now());
    Session.setDefault('pomodoroRunning', false);
  });

  Template.timer.onRendered(function() {
    this.updateTime = function() {
      Session.set('now', Date.now());
    };

    this.timer = Meteor.setInterval(this.updateTime, 100);
  });

  Template.timer.onDestroyed(function() {

  });

  Template.timer.helpers({
    time: function() {
      return moment(Session.get('now')).format('LTS');
    },
    date: function() {
      return moment(Session.get('now')).format('dddd, MMMM Do YYYY');
    },
    isRunning: function() {
      return Session.get('pomodoroRunning');
    },
    timeToDone: function() {
      if (Session.get('pomodoroRunning') && Session.get('pomodoroEnd') > Session.get('now')) {
        return 'take a break ' + moment(Session.get('pomodoroEnd')).fromNow();
      }
      // slight helper abuse, sets this value when we're out of time.
      Session.set('pomodoroRunning', false);
    },
    exactTimeToDone: function() {
      return moment(moment(Session.get('pomodoroEnd')).diff(Session.get('now'))).format('mm:ss');
    },
    buttonText: function() {
      return Session.get('pomodoroRunning') ? 'stop' : 'start';
    },
    activeClass: function() {
      return Session.get('pomodoroRunning') ? 'active' : '';
    }
  });

  Template.timer.events({
    'click button': function(event, template) {
      if (Session.get('pomodoroRunning')) {
        return Session.set('pomodoroRunning', false);
      }

      Session.set('pomodoroRunning', true);
      Session.set('pomodoroEnd', new Date().getTime()+(25*60*1000) );
    }
  });

} // end if client
