import React, { useRef, useState } from 'react';
import {View, Text} from 'react-native';
import tw from 'twrnc';
import { Chart } from './Chart';

const Graph = () => {
  const [chartWidth, setChartWidth] = useState(0)
  return (
    <View style={[tw`mt-.5 mb-4 h-128 bg-white rounded-md shadow-md`]}>
      {/* AREA ON THE TOP */}
      <View style={[tw`px-4 py-5 border-b border-gray-200`]}>
        <View
          style={tw`-ml-2 -mt-4 flex flex-wrap items-center justify-between`}>
          <View style={tw`ml-4 mt-4`}>
            <Text style={[tw`text-lg leading-6 text-gray-900`]}>Pacing</Text>
            <Text style={tw`mt-1 text-sm text-gray-500`}>
              Monitor how fast you&apos;re exerting energy today
            </Text>
          </View>
        </View>
      </View>
      {/* CHART */}
      <View style={[tw`py-4 px-5`]}>
        <View style={tw`flex justify-center items-center`}>
          <Text style={[tw`pb-1 text-emerald-500 text-sm`]}>
            Today&apos;s steps
          </Text>
          <Text
            style={[tw`m-auto pb-2 text-3xl tracking-tight text-emerald-600`]}>
            1020
          </Text>
          <View
            style={tw`flex items-center rounded-full bg-red-100 px-2.5 py-0.5`}>
            <Text style={tw`text-sm text-red-800`}>Yesterday: 500</Text>
          </View>
          {/* ********************* */}
          {/* LOCATION OF THE CHART */}
          <View style={{ height: 200, marginTop: 10, width: '100%' }}
            onLayout={(event) => {
              let { width } = event.nativeEvent.layout;
              setChartWidth(width) 
              
            }}
          >
            <Chart chartHeight={180} chartWidth={chartWidth}/>
          </View>
          {/* ********************* */}
        </View>
      </View>
      {/* STATS AREA ON THE BOTTOM */}
      <View style={tw`border-t border-gray-200 inset-x-0 bottom-0 absolute`}>
        <View style={tw`flex flex-row flex-3 justify-center`}>
          {/* FIRST STAT */}
          <View style={tw`p-4 px-6`}>
            <View
              style={tw`flex-1 leading-6 text-gray-500 text-sm font-medium text-gray-500`}>
              <Text
                style={tw`m-auto text-sm font-medium leading-6 text-emerald-500`}>
                Distance
              </Text>
              <Text
                style={[tw`m-auto text-3xl tracking-tight text-emerald-600`]}>
                .3 mi
              </Text>
            </View>
          </View>
          <View style={tw`p-4 px-6`}>
            <View
              style={tw`flex-1 leading-6 text-gray-500 text-sm font-medium text-gray-500`}>
              <Text
                style={tw`m-auto text-sm font-medium leading-6 text-emerald-500`}>
                Calories
              </Text>
              <Text
                style={[tw`m-auto text-3xl tracking-tight text-emerald-600`]}>
                763
              </Text>
            </View>
          </View>
          <View style={tw`p-4 px-6`}>
            <View
              style={tw`flex-1 leading-6 text-gray-500 text-sm font-medium text-gray-500`}>
              <Text
                style={tw`m-auto text-sm font-medium leading-6 text-emerald-500`}>
                Active time
              </Text>
              <Text
                style={[tw`m-auto text-3xl tracking-tight text-emerald-600`]}>
                21 min
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Graph;
