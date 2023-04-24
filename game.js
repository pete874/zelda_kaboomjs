//This game on done with kaboom version 0.5.0 (same as in video)
//Documentation for version 0.5.0 can be found @ https://legacy.kaboomjs.com/

//start kaboom with chosen properties
kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
  debug: true,
  clearColor: [0,0,0,1]
})

//constants
const MOVE_SPEED = 120
const SKELETOR_SPEED = 60
const SLICER_SPEED = 100

//set root for loadSprite() method
loadRoot('https://i.imgur.com/')

//now it loads the file from root above. In this case E.g https://i.imgur.com/1Xq9biB.png
loadSprite('link-going-left', '1Xq9biB.png')
loadSprite('link-going-right', 'yZIb8O2.png')
loadSprite('link-going-down', 'r377FIM.png')
loadSprite('link-going-up', 'UkV0we0.png')
loadSprite('left-wall', 'rfDoaa1.png')
loadSprite('top-wall', 'QA257Bj.png')
loadSprite('bottom-wall', 'vWJWmvb.png')
loadSprite('right-wall', 'SmHhgUn.png')
loadSprite('bottom-left-wall', 'awnTfNC.png')
loadSprite('bottom-right-wall', '84oyTFy.png')
loadSprite('top-left-wall', 'xlpUxIm.png')
loadSprite('top-right-wall', 'z0OmBd1.jpg')
loadSprite('top-door', 'U9nre4n.png')
loadSprite('fire-pot', 'I7xSp7w.png')
loadSprite('left-door', 'okdJNls.png')
loadSprite('lanterns', 'wiSiY09.png')
loadSprite('slicer', 'c6JFi5Z.png')
loadSprite('skeletor', 'Ei1VnX8.png')
loadSprite('kaboom', 'o9WizfI.png')
loadSprite('stairs', 'VghkL08.png')
loadSprite('bg', 'u4DVsx6.png')

//game scene
scene("game", ({ level, score }) => {

  //setting background, object and user interface layers. default layer is set to 'obj'
  layers(['bg', 'obj', 'ui'], 'obj')

  //maps
  const maps = [
    [
      'ycc)ccc^cw',
      'a        b',
      'a  *     b',
      'a  (     b',
      '%        b',
      'a      ( b',
      'a     *  b',
      'a        b',
      'xdd)dd)ddz',
    ],
    [
      'yccccccccw',
      'a        b',
      ')        )',
      'a        b',
      'a        b',
      'a    $   b',
      ')   }    )',
      'a        b',
      'xddddddddz',
    ]

  ]

  //level configuration constant. Setting image size(48x48) and adding sprites, so that they can be used in maps
  const levelCfg = {
    width: 48,
    height: 48,
    'a': [sprite('left-wall'), solid(), 'wall'],
    'b': [sprite('right-wall'), solid(), 'wall'],
    'c': [sprite('top-wall'), solid(), 'wall'],
    'd': [sprite('bottom-wall'), solid(), 'wall'],
    'w': [sprite('top-right-wall'), solid(), 'wall'],
    'x': [sprite('bottom-left-wall'), solid(), 'wall'],
    'y': [sprite('top-left-wall'), solid(), 'wall'],
    'z': [sprite('bottom-right-wall'), solid(), 'wall'],
    '%': [sprite('left-door'), solid(), 'door'],
    '^': [sprite('top-door'), 'next-level'],
    '$': [sprite('stairs'), 'next-level'],
    '*': [sprite('slicer'), 'slicer', { dir: -1 }, 'dangerous'],
    '}': [sprite('skeletor'), 'dangerous', 'skeletor', { dir: -1, timer: 0 }],
    ')': [sprite('lanterns'), solid()],
    '(': [sprite('fire-pot'), solid()],
  }

  //add level using maps[index] and levelCfg constants
  addLevel(maps[level], levelCfg)

  //add background(floor in this case) and set it to layer 'bg', so is doesnt interfere with anything else
  add([sprite('bg'), layer('bg')])

  //score label constant. Set text, position and value and then set it to 'ui' layer
  const scoreLabel = add([
    text('0'),
    pos(400, 450),
    layer('ui'),
    {
      value: score,
    },
    scale(2) //scale up
  ])

  //add text level and level number to bottom right
  add([text('level ' + parseInt(level + 1)), pos(400, 485), scale(2)])

  //add player and position. Players face is set to point to right
  const player = add([
    sprite('link-going-right'),
    pos(5, 190),
    {
      dir: vec2(1,0),
    }
  ])

  //prevents player from moving through objects, that are set to solid() in map
  player.action(() => {
    player.resolve()
  })

  //if player collides anything with tag 'next-level'. Passing score and level values
  player.overlaps('next-level', () => {
    go("game", {
      level: (level + 1) % maps.length,
      score: scoreLabel.value
    })
  })

  //Keypresses below

  //what happens when left arrow is pushed. Player goes left and face points to left
  keyDown('left', () => {
    player.changeSprite('link-going-left')
    player.move(-MOVE_SPEED, 0)
    player.dir = vec2(-1,0)
  })

  //what happens when right arrow is pushed.  Player goes right and face points to right
  keyDown('right', () => {
    player.changeSprite('link-going-right')
    player.move(MOVE_SPEED, 0)
    player.dir = vec2(1,0)
  })

  //what happens when up arrow is pushed.  Player goes up and face points to up
  keyDown('up', () => {
    player.changeSprite('link-going-up')
    player.move(0, -MOVE_SPEED)
    player.dir = vec2(0,-1)
  })

  //what happens when down arrow is pushed.  Player goes down and face points to down
  keyDown('down', () => {
    player.changeSprite('link-going-down')
    player.move(0, MOVE_SPEED)
    player.dir = vec2(0,1)
  })

  //function for kaboom explosion when pressing sapde
  function spawnKaboom(p) {
    const obj = add([sprite('kaboom'), pos(p), 'kaboom'])
    wait(1, () => {
      destroy(obj)
    })
  }

  //what happens when space is pressed. Calling kaboom function above
  keyPress('space', () => {
    spawnKaboom(player.pos.add(player.dir.scale(48)))
  })

  //what happens if player collides with tag 'door'
  player.collides('door', (d) => {
    destroy(d)
  })

  //what happens if kaboom(space keypress) collides/hits skeletor. Destroyed with camshake and player gets 1 point
  collides('kaboom', 'skeletor', (k, s) => {
    camShake(4)
    wait(1, () => {
      destroy(k)
    })
    destroy(s)
    scoreLabel.value++
    scoreLabel.text = scoreLabel.value
  })

  //make slicers move
  action('slicer', (s) => {
    s.move(s.dir * SLICER_SPEED, 0)
  })

  //if slicer collides with 'wall', it changes to opposite direction
  collides('slicer', 'wall', (s) => {
    s.dir = -s.dir
  })

  //makes skeletor move randomly
  action('skeletor', (s) => {
    s.move(0, s.dir * SKELETOR_SPEED)
    s.timer -= dt()
    if (s.timer <= 0) {
      s.dir = - s.dir
      s.timer = rand(5)
    }
  })

  //if anything tagged 'dangerous' hits wall, it changes direction
  collides('dangerous', 'wall', (s) => {
    s.dir = -s.dir
  })

  //what happens when player collides anything that is set to tag 'dangerous'.
  //goes to 'lose' scene and passes score value
  player.overlaps('dangerous', () => {
    go('lose', { score: scoreLabel.value})
  })
})

//'lose' scene with score displayed
scene("lose", ({ score }) => {
  add([text(score + ' Points', 32), origin('center'), pos(width()/ 2, height() /2)])
})

//start 'game' scene and pass starting value 0 to level and score. 
start("game", { level: 0, score: 0})