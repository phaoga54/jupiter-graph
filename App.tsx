import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';

import tw from 'twrnc';

import Graph from './components/Graph';

const App: React.FC = () => {
  const backgroundColor = {
    backgroundColor: '#ccfbf1',
  };

  return (
    <>
      <StatusBar barStyle={'light-content'} backgroundColor={'white'} />
      <View style={[tw`flex-row justify-center pb-4`, backgroundColor]}>
        <View style={tw`border-b border-gray-400 pb-4 w-24`}>
          <Text style={tw`text-center text-xs font-medium text-gray-600 pt-4`}>
            Today
          </Text>
        </View>
      </View>
      <SafeAreaView style={[backgroundColor, { flex: 1 }]}>

        <View style={[tw`mx-auto px-4 pb-24`, { flex: 1 }]}>
          {/* HERE'S WHERE THE CHART WILL GO  */}
          <Graph />
        </View>
      </SafeAreaView>
    </>
  );
};

export default App;
