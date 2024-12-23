import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Icons = ({ type }) => {

  let imageSource;
  let iconStyle = [styles.icon];

  switch (type) {
    case 'home':
      imageSource = require('../assets/panel/home.png');
      iconStyle.push(styles.active);
      break;
    case 'book':
      imageSource = require('../assets/panel/book.png');
      iconStyle.push(styles.active);
      break;
    case 'goal':
      imageSource = require('../assets/panel/goal.png');
      iconStyle.push(styles.active);
      break;
    case 'game':
      imageSource = require('../assets/panel/game.png');
      iconStyle.push(styles.active);
      break;
    case 'settings':
      imageSource = require('../assets/panel/settings.png');
      iconStyle.push(styles.active);
      break;
    case 'close':
        imageSource = require('../assets/common/close.png');
    break;
    case 'heart':
        imageSource = require('../assets/common/heart.png');
    break;
    case 'heart-grey':
        imageSource = require('../assets/common/heart-grey.png');
    break;
    case 'hint':
        imageSource = require('../assets/common/hint.png');
    break;
    case 'back':
        imageSource = require('../assets/common/back.png');
        iconStyle.push(styles.back);
    break;
    case 'arrow':
        imageSource = require('../assets/common/arrow.png');
        iconStyle.push(styles.pink);
    break;
    case 'save':
      imageSource = require('../assets/common/save.png');
      iconStyle.push(styles.back);
    break;
    case 'saved':
        imageSource = require('../assets/common/saved.png');
        iconStyle.push(styles.back);
    break;
    case 'music':
        imageSource = require('../assets/common/music.png');
    break;
    case 'vibration':
        imageSource = require('../assets/common/vibration.png');
    break;
    case 'bonus':
        imageSource = require('../assets/decor/bonus.png');
    break;
  }

  return (
    <Image 
      source={imageSource} 
      style={iconStyle} 
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  active: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    tintColor: '#fff',
  },
  back: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    tintColor: '#8454ff',
  },
  pink: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    tintColor: '#e75da5',
  }
});

export default Icons;
