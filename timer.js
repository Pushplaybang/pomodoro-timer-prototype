if (Meteor.isClient) {
  Template.timer.onCreated(function() {
    Session.setDefault('now', Date.now());
    Session.setDefault('pomodoroRunning', false);
  });

  Template.timer.onRendered(function() {
    var instance  = this;

    instance.updateTime = function() {
      Session.set('now', Date.now());
    };

    instance.timer = Meteor.setInterval(instance.updateTime, 100);
  });

  Template.timer.helpers({
    time: function() {
      return moment(Session.get('now')).format('LTS');
    },
    date: function() {
      return moment(Session.get('now')).format('dddd, MMMM Do YYYY');
    },
    timeToDone: function() {
      if (Session.get('pomodoroRunning') && Session.get('pomodoroEnd') > Session.get('now')) {
        return 'take a break, ' + moment(Session.get('pomodoroEnd')).fromNow();
      }

      Session.set('pomodoroRunning', false);
      return false;
    },
    exactTimeToDone: function() {
      return moment(moment(Session.get('pomodoroEnd')).diff(Session.get('now'))).format('mm:ss');
    },
    isRunning: function() {
      return Session.get('pomodoroRunning');
    },
    buttonText: function() {
      if (!Session.get('pomodoroRunning')) {
        return 'start';
      }

      return 'stop';
    }
  });

  Template.timer.events({
    'click button': function() {
      if (!Session.get('pomodoroRunning')) {
        Session.set('pomodoroRunning', true);
        Session.set('pomodoroEnd', new Date().getTime()+(25*60*1000) );
      } else {
        Session.set('pomodoroRunning', false);
      }
    }
  });
}
