'use strict';

var viewPort = {
  width: window.innerWidth,
  height: window.innerHeight,
  top: 0,
  left: 0
};

var maxJump = 65;
var stateJump = JSON.stringify(JSON.parse(maxJump));
var floor = 0;
var GRAVITY = 8;
var acceleration = GRAVITY / stateJump;

function runMovement(person) {
  // create new position of the person
  var newPosition;

  // run when a new movement is place
  if (person.movement) {
    // select type of movement
    switch (person.movement) {
      case 'jump':
        newPosition = jump(person);
        break;

      case 'right':
        // console.log('move right');
        newPosition = movingRight(person);
        break;

      case 'left':
        // console.log('move left');
        newPosition = movingLeft(person);
        break;

      default:
        newPosition = person;
        break;
    }
    newPosition.movement = null;
    // run when not new movement is selected
  } else {
    // select type of movement by state
    // console.log('state', person.state);

    if (person.state.length === 0) {
      newPosition = person;
    } else {
      for (var i = 0; i < person.state.length; i++) {
        switch (person.state[i]) {
          case 'jumping':
            // console.log('state jumping');
            newPosition = jumping(person);
            break;

          case 'movingRight':
            // console.log('state moving right');
            newPosition = movingRight(person);
            break;

          case 'movingLeft':
            // console.log('state moving left');
            newPosition = movingLeft(person);
            break;

          case 'dying':
            newPosition = dying(person);
            break;
        }
      }
    }
  }
  return gravity(newPosition);
}

function movingRight(person) {
  person.img = person.images.base;
  var personRight = person.left + person.width;
  if (personRight < stage.width && (personRight < viewPort.width || person.type !== 'hero')) {
    person.left = person.left + 1;
  } else {
    if (person.type === 'hero') {
      person.movement = null;
    } else {
      person.left = person.left - 1;
      person.state.push('movingLeft');
      console.log('1');
    }
    var i = person.state.indexOf('movingRight');
    person.state.splice(i, 1);
  }
  return person;
}

function movingLeft(person) {
  person.img = person.images.left;
  if (person.left > stage.left) {
    person.left = person.left - 1;
  } else {
    if (person.type === 'hero') {
      person.movement = null;
    } else {
      person.left = person.left + 1;
      person.state.push('movingRight');
    }
    var i = person.state.indexOf('movingLeft');
    person.state.splice(i, 1);
  }
  return person;
}

function jump(person) {
  if (person.state.indexOf('jumping') === -1) {
    if (person.top + person.height >= viewPort.height - calculateFloor(person)) {
      stateJump = 0;
      person.state.push('jumping');
    } else {
      stateJump = JSON.stringify(JSON.parse(maxJump));
    }
  }
  return person;
}

function jumping(person) {
  if (stateJump < maxJump) {
    person.top = person.top - 2;
    stateJump = stateJump + 1;
  } else {
    person.movement = null;
    var i = person.state.indexOf('jumping');
    person.state.splice(i, 1);
  }
  return person;
}

function gravity(person) {
  if (person.state.indexOf('jumping') === -1) {
    if (person.top + person.height < viewPort.height - calculateFloor(person)) {
      person.top = person.top + 2;
    }
  }
  return person;
}

function dying(person) {
  if (person.top < viewPort.height) {
    person.top = person.top + 3;
  } else {
    person.state = [];
  }
  return person;
}

function calculateFloor(person) {
  if (person.id === 'mrwick') {
    // console.log(person);
  }

  var _floor = stage.bottom;
  for (let i = 0; i < stage.parts.length; i++) {
    var part = stage.parts[i];
    var personRight = person.left + person.width;
    var personBottom = person.top + person.height;
    var partTop = viewPort.height + part.top;
    if (person.id === 'mrwick') {
      // console.log(personRight, part.left, personBottom, partTop);

      if (personRight >= part.left && personBottom <= partTop) {
        // console.log('inside');
        // clearInterval(ticker);
        _floor = Math.abs(part.top) + stage.bottom;
      }
    }
  }

  // setTimeout(() => {
  //   clearInterval(ticker);
  // }, 2000);

  return _floor;
}
