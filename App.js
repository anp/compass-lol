// @flow
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KeepAwake, Location } from 'expo';
import debounce from 'lodash.debounce';

let locationWatcher = null;

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { heading: 0, accuracy: 0 };

    this.setStateDebounced = debounce(this.setState, 5);
  }

  componentWillMount() {
    if (!locationWatcher) {
      locationWatcher = Location.watchHeadingAsync(({ magHeading, trueHeading, accuracy }) => {
      console.log(magHeading, trueHeading, accuracy);

      this.setStateDebounced({ heading: trueHeading || magHeading, accuracy });
    });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <KeepAwake/>
        <Text>{this.state.heading}</Text>
        <Text>{this.state.accuracy}</Text>
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
