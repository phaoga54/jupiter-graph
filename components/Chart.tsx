import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, useWindowDimensions, Text } from 'react-native';
import Svg, { Defs, Path, Stop, LinearGradient } from "react-native-svg";

export const HEIGHT = 480

import { scaleLinear } from "d3-scale";
import DATA from './distance_data.json'

type DataChart = {
    x: number
    y: number
}[]
const STEPS = 15

export const getLinePath = (data: DataChart, height: number, width: number) => {
    const formattedValues = data.map(
        (value) => [value?.x, value?.y]
    );
    const yArr = formattedValues.map((value) => value[1]);
    const xArr = formattedValues.map((value) => value[0]);

    const minY = Math.min(...yArr);
    const maxY = Math.max(...yArr);

    const scaleX = scaleLinear()
        .domain([Math.min(...xArr), Math.max(...xArr)])
        .range([0, width]);

    const scaleY = scaleLinear().domain([minY, maxY]).range([0, height]);

    let path = ''
    for (let i = 0; i < data.length; i++) {
        const prevX = i > 0 ? data[i - 1].x : 0
        const prevY = i > 0 ? data[i - 1].y : 0
        const x = data[i].x
        const y = data[i].y

        if (i == 0) path += `M ${scaleX(x)},${scaleY(y)}`
        else if (y == 0) path += `M ${scaleX(prevX)},${scaleY(prevY)}`
        else if (data[i - 1].y === 0) path += `M ${scaleX(x)},${scaleY(y)}`
        else path += `L ${scaleX(x)},${scaleY(y)}`
    }

    return path
}

export const getFillLine = (data: DataChart, height: number, width: number) => {
    const formattedValues = data.map(
        (value) => [value?.x, value?.y]
    );
    const yArr = formattedValues.map((value) => value[1]);
    const xArr = formattedValues.map((value) => value[0]);

    const minY = Math.min(...yArr);
    const maxY = Math.max(...yArr);

    const scaleX = scaleLinear()
        .domain([Math.min(...xArr), Math.max(...xArr)])
        .range([0, width]);

    const scaleY = scaleLinear().domain([minY, maxY]).range([0, height]);

    let path = ''
    for (let i = 0; i < data.length; i++) {

        const prevX = i > 0 ? data[i - 1].x : 0
        const rawX = data[i].x
        const rawY = data[i].y
        const x = scaleX(rawX)
        const y = scaleY(rawY)

        if (i == 0) path += `M ${x},${y}`
        else if (rawY == 0) path += `L ${scaleX(prevX)},${scaleY(0)} L ${x},${y}`
        else if (data[i - 1].y === 0) path += `L ${x},${scaleY(0)}, L ${x},${y}`
        else path += `L ${x},${y}`
    }

    return path + `L ${scaleX(xArr[xArr.length - 1])},0`
}
export const Chart = ({ chartWidth, chartHeight }: { chartWidth: number, chartHeight: number }) => {
    if(chartWidth==0) return null
    const { width } = useWindowDimensions()
    const SVGHeight = chartHeight;
    const SVGWidth = chartWidth;
    const [pathLine, setPathLine] = useState('M 0 0')
    const [fillLine, setFillLine] = useState('M 0 0')
    const [chartData, setChartData] = useState<{ x: number, y: number }[]>([])


    useEffect(() => {
        if (chartData.length) {
            const tempPathLine = getLinePath(chartData, SVGHeight - 5, SVGWidth);
            const tempFillLine = getFillLine(chartData, SVGHeight - 5, SVGWidth);

            setPathLine(tempPathLine)
            setFillLine(tempFillLine)
        }
    }, [chartData])

    useEffect(() => {
        const formatData = () => {
            const formattedData: { x: number, y: number }[] = []
            DATA.forEach((item, index) => {
                const x = index * STEPS
                const y = item.steps
                formattedData.push({ x, y })
            })
            setChartData(formattedData)
        }
        formatData()
    }, [])
    return (
        <View>

            <View style={{
                transform: [{
                    rotateX: '180deg'
                }],
                height: SVGHeight
            }}>
                <Svg width={SVGWidth} height={SVGHeight} viewBox={`${0} ${0} ${SVGWidth} ${SVGHeight}`}>
                    <Defs>
                        <LinearGradient id="down2" x1="0%" y1="0%" x2="0%" y2="100%">
                            <Stop offset="30%" stopColor="rgb(153, 255, 206)" stopOpacity={1} />
                            <Stop offset="100%" stopColor="rgb(255, 255, 255)" stopOpacity={0.3} />
                        </LinearGradient>
                    </Defs>
                    <Path strokeWidth={0} d={fillLine} strokeDasharray="10,5" stroke={"#C9E2ED"}
                        fill={'url(#down2)'}
                    />
                    <Path stroke={"#247BA0"} d={pathLine} strokeWidth={2} fill={'transparent'} />
                </Svg>
            </View>
            <View style={{ flexDirection: 'row',justifyContent:'space-around',marginTop:5 }}>

                <Text>4 AM</Text>
                <Text>8 AM</Text>
                <Text>12 PM</Text>
                <Text>4 PM</Text>
                <Text>8 PM</Text>
            </View>
        </View>
    )
}
