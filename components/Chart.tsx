import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Svg, { Defs, Path, Stop, LinearGradient, Line } from "react-native-svg";
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

    const dailyLimit = 500

    const maxSteps = Math.max(...[...DATA.map(o => o.steps), ...DATA_24.map(o => o.steps),dailyLimit])
    const minSteps = Math.min(...[...DATA.map(o => o.steps), ...DATA_24.map(o => o.steps)])


    const [todayLine, setTodayLine] = useState('M 0 0')
    const [yesterdayLine, setYesterdayLine] = useState('M 0 0')

    const [todayData, setTodayData] = useState<{ x: number, y: number }[]>([])
    const [yesterdayData, setYesterdayData] = useState<{ x: number, y: number }[]>([])

    const scaleX = scaleLinear().domain([START_X, FINISH_X]).range([0, chartWidth]);
    const scaleY = scaleLinear().domain([minSteps, maxSteps]).range([2, SVGHeight - 5]);


    const getLinePath = (data: DataChart) => {

        return `M0,0`
            + `${(shape
                .line()
                .x((d: any) => scaleX(d.x))
                .y((d: any) => scaleY(d.y))
                .curve(shape.curveBasis)
                (data) as string)} `
    }


    useEffect(() => {
        if (todayData.length) {
            const tempPathLine = getLinePath(todayData);

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
        const formatData = (data: any, debug?: boolean) => {
            const formattedData: DataChart = []
            data.forEach((item: any) => {
                const currentTime = moment(item.timestamp, 'YYYY-MM-DD[T]HH:mm:ss')
                const minutes = currentTime.hours() * 60 + currentTime.minutes()
                if (minutes >= 240) {
                    const x = minutes
                    const y = Number(item.steps) + (debug ? 4000 : 0)

                    formattedData.push({ x, y })
                }
            })
            return formattedData
        }

        setYesterdayData(formatData(DATA))
        setTodayData(formatData(DATA_24))
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
                    <Path stroke={"#F87171"} d={yesterdayLine} strokeWidth={2} fill={'transparent'} />
                    <Path stroke={"#047857"} d={todayLine} strokeWidth={2} fill={'transparent'} />
                </Svg>
                {
                    (todayData?.length && yesterdayData?.length) ? <>
                        <Cursor
                            point={todayData[todayData.length - 1]}
                            scaleX={scaleX}
                            scaleY={scaleY}
                            stroke={"#047857"}
                            fill={'#059669'}
                        />
                        <Cursor
                            point={{
                                x: todayData[todayData.length - 1]?.x,
                                y: yesterdayData.find(value => value.x === todayData[todayData.length - 1].x)?.y || 0
                            }}
                            scaleX={scaleX}
                            scaleY={scaleY}
                            stroke={"#F87171"}
                            fill={'#FCA5A5'}
                        />
                    </>
                        : null
                }
                <View style={{ position: 'absolute', top: scaleY(dailyLimit),}}>
                    <Svg height={2} width={SVGWidth} style={{ alignSelf: 'center' }}>
                        <Line
                            stroke="gray"
                            strokeDasharray="7, 7"
                            strokeWidth={2}
                            x1="0"
                            y1="0"
                            x2={SVGWidth}
                            y2={2}
                        />
                    </Svg>
                    <Text style={[tw`mt-1 text-sm text-gray-500`, {
                        transform: [{ rotateX: '-180deg' }],
                    }]}>Daily limit</Text>
                </View>
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
    if (!point) return null

    const { x, y } = point

    const CURSOR_SIZE = 15 * 0.8
    const left = scaleX(x) - CURSOR_SIZE / 2
    const top = scaleY(y) - CURSOR_SIZE / 2

    return <View style={[{
        left, top, width: CURSOR_SIZE,
        height: CURSOR_SIZE, backgroundColor: fill,
        borderColor: stroke,
    }, tw` absolute rounded-full border-2`]}>

    </View>
}