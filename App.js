// @flow
import React from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { KeepAwake, Location, Permissions } from 'expo';
import debounce from 'lodash.debounce';

let locationWatcher = null;

class Compass extends React.Component {
  constructor() {
    super();
    this.state = { heading: new Animated.Value(0), accuracy: 0 };

    this.onRotateDebounced = debounce(this.onRotate, 100);
  }

  onRotate(heading) {
    Animated.timing(this.state.heading, {
      toValue: 360 - heading,
      duration: 170,
    }).start();
  }

  componentWillMount() {
    if (!locationWatcher) {
      locationWatcher = Location.watchHeadingAsync(({ magHeading, trueHeading, accuracy }) => {
        this.onRotateDebounced(trueHeading || magHeading);
      });
    }
  }

  render() {
    let rotationAmount = this.state.heading.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg'],
    });

    return(<Animated.View
          style={{transform: [{ rotate: rotationAmount }]}}>
          <Text>north</Text>
          <Image style={{ width: 150, height: 150 }}
            source={require('./assets/hotdog.gif')}/>
          <Text>accuracy: {this.state.accuracy}</Text>
          </Animated.View>);
  }
}

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      errorMessage: '',
    };
  }
  async componentWillMount() {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'ahhh',
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <KeepAwake/>
        {this.state.errorMessage === 'ahhh' ? <Text>'lol you should have accepted'</Text> : <Compass/>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
