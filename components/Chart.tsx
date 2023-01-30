import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Svg, { Defs, Path, Stop, LinearGradient } from "react-native-svg";
import tw from 'twrnc';
import { scaleLinear } from "d3-scale";
import DATA from './step_data_jan_23rd.json'
import DATA_24 from './step_data_jan_24th.json'
import * as shape from "d3-shape";
import moment from 'moment'

const START_X = 4 * 60
const FINISH_X = 24 * 60
type DataChart = {
    x: number
    y: number
}[]

export const Chart = ({ chartWidth, chartHeight }: { chartWidth: number, chartHeight: number }) => {
    if (chartWidth == 0) return null

    const SVGHeight = chartHeight;
    const SVGWidth = chartWidth;
    const maxSteps = Math.max(...[...DATA.map(o => o.steps), ...DATA_24.map(o => o.steps)])
    const minSteps = Math.min(...[...DATA.map(o => o.steps), ...DATA_24.map(o => o.steps)])

    const [todayLine, setTodayLine] = useState('M 0 0')

    const [yesterdayLine, setYesterdayLine] = useState('M 0 0')

    const [todayData, setTodayData] = useState<{ x: number, y: number }[]>([])
    const [yesterdayData, setYesterdayData] = useState<{ x: number, y: number }[]>([])

    const scaleX = scaleLinear().domain([START_X, FINISH_X]).range([0, chartWidth]);
    const scaleY = scaleLinear().domain([minSteps, maxSteps]).range([2, SVGHeight - 5]);


    const getLinePath = (data: DataChart) => {
        const lastX = data[data.length - 1].x

        return `M0,0`
            + `${(shape
                .line()
                .x((d: any) => scaleX(d.x))
                .y((d: any) => scaleY(d.y))
                .curve(shape.curveCatmullRom)
                (data) as string)} `
    }


    useEffect(() => {
        if (todayData.length) {
            const tempPathLine = getLinePath(todayData);
// console.log('tempPathLine: ',tempPathLine);

            setTodayLine(tempPathLine)
        }
    }, [todayData])

    useEffect(() => {
        if (yesterdayData.length) {
            const tempPathLine = getLinePath(yesterdayData);
            setYesterdayLine(tempPathLine)
        }
    }, [yesterdayData])

    useEffect(() => {
        const formatData = (data: any,debug?:boolean) => {
            const formattedData: DataChart = []
            data.forEach((item: any, index: any) => {
                if (index > 240) {
                    if (index % 1 === 0) {
                        const currentTime = moment(item.timestamp, 'YYYY-MM-DD[T]HH:mm:ss')
                        const x = currentTime.hours() * 60 + currentTime.minutes()
                        const y = Number(item.steps) + (debug?4000:0)

                        formattedData.push({ x, y })
                    }
                }
            })
            return formattedData
        }

        setYesterdayData(formatData(DATA))
        setTodayData(formatData(DATA_24,true))
        
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
                    <Path stroke={"#F87171"} d={yesterdayLine} strokeWidth={2} fill={'transparent'} />
                    <Path stroke={"#047857"} d={todayLine} strokeWidth={2} fill={'transparent'} />
                </Svg>
                <Cursor
                    point={todayData[todayData.length - 1]}
                    scaleX={scaleX}
                    scaleY={scaleY}
                    stroke={"#047857"}
                    fill={'#059669'}
                />
                <Cursor
                    point={yesterdayData[todayData.length - 1]}
                    scaleX={scaleX}
                    scaleY={scaleY}
                    stroke={"#F87171"}
                    fill={'#FCA5A5'}
                />
            </View>
            <View style={[tw`flex-row justify-around mt-1.5`]}>

                <Text>4 AM</Text>
                <Text>8 AM</Text>
                <Text>12 PM</Text>
                <Text>4 PM</Text>
                <Text>8 PM</Text>
            </View>
        </View>
    )
}
type CursorProps = {
    point: { x: number, y: number },
    scaleX: (value: number) => number, scaleY: (value: number) => number,
    fill: string
    stroke: string
}
const Cursor = ({ point, scaleX, scaleY, fill, stroke }: CursorProps) => {
    if(!point) return null
    
    const { x, y } = point
    
    const CURSOR_SIZE = 15*0.8
    const left = scaleX(x) - CURSOR_SIZE / 2
    const top = scaleY(y) - CURSOR_SIZE / 2

    return <View style={[{
        left, top, width: CURSOR_SIZE,
        height: CURSOR_SIZE, backgroundColor: fill,
        borderColor: stroke,
    },tw` absolute rounded-full border-2`]}>

    </View>
}