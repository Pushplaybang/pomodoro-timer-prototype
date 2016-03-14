// Only run this on the client
if (Meteor.isClient) {

  // When the template is created, create our reactive data sources.
  Template.timer.onCreated(function() {
    // using session as its available by default
    Session.setDefault('now', Date.now());
    Session.setDefault('pomodoroRunning', false);
    Session.setDefault('pomodoroEnd', false);
  });

  // When the tempaltes is rendered, start a setInterval loop
  Template.timer.onRendered(function() {
    this.updateTime = function() {
      Session.set('now', Date.now());
    };

    // run the callback to keep updating our reactive data
    this.timer = Meteor.setInterval(this.updateTime, 100);
  });

  // When the tempalate is destroyed kill the timer
  Template.timer.onDestroyed(function() {
    Meteor.clearInterval(this.timer);
  });

  // define helpers for the template
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
      if (Session.get('pomodoroRunning') && Session.get('pomodoroEnd') > Session.get('now'))
        return 'take a break ' + moment(Session.get('pomodoroEnd')).fromNow();

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

  // define some events.
  Template.timer.events({
    'click button': function(event, template) {
      // if our countdown is running, kill it.
      if (Session.get('pomodoroRunning'))
        return Session.set('pomodoroRunning', false);

      // else start the countdown
      Session.set('pomodoroRunning', true);
      Session.set('pomodoroEnd', new Date().getTime()+(25*60*1000) );
    }
  });

} // end if client block
