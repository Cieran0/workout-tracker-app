import React from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import { colors, typography } from '../shared/theme';

const screenWidth = Dimensions.get('window').width;

interface BarGraphProps {
    barName: string;
    data: {
        labels: string[];
        datasets: {
            data: number[];
        }[];
    };
    width: number;
    height?: number;
    barColor?: string;
}


const BarGraph: React.FC<BarGraphProps> = ({
    barName,
    data,
    width,
    height = 200,
    barColor = '#00FF88',
}) => {
    const { labels } = data;
    const values = data.datasets[0].data;
    const maxValue = Math.max(...values);
    const numBars = values.length;
    const textColor = colors.text;

    // Layout constants
    const gap = 10;
    const leftMargin = 20; // Space for Y-axis labels
    const rightMargin = 10 + gap;
    const availableWidth = (width - leftMargin) - rightMargin;
    const barWidth = (availableWidth - gap * (numBars - 1)) / numBars;

    // Generate horizontal lines at integer intervals
    const lines = maxValue > 0
        ? Array.from({ length: Math.ceil(maxValue) }, (_, i) => i + 1)
        : [];

    return (
        <View style={[styles.container, { width, height }]}>
            <Text style={[typography.subtitle, {marginBottom: 10, color: colors.text}]}>
                {barName} 
            </Text>
            <Svg width={width} height={height}>
                {/* Y-axis labels and lines */}
                {lines.map((v, idx) => {
                    const y = height - (v / maxValue) * (height - 30) - 20;
                    return (
                        <React.Fragment key={idx}>
                            <Line
                                x1={leftMargin} // Start after Y-axis
                                y1={y}
                                x2={width - rightMargin} // End before right margin
                                y2={y}
                                stroke="#333"
                                strokeWidth="1"
                                strokeDasharray="2"
                            />
                            <SvgText
                                x={leftMargin - 5} // Position to left of Y-axis
                                y={y}
                                fontSize="14"
                                fill={textColor}
                                alignmentBaseline="middle"
                                textAnchor="end"
                            >
                                {v}
                            </SvgText>
                        </React.Fragment>
                    );
                })}

                {/* Bars */}
                {values.map((value, index) => {
                    const barHeight = (value / maxValue) * (height - 30);
                    const x = leftMargin + gap + index * (barWidth + gap);
                    const yBar = height - barHeight - 20;

                    return (
                        <React.Fragment key={index}>
                            <Rect
                                x={x}
                                y={yBar}
                                width={barWidth}
                                height={barHeight}
                                fill={barColor}
                                rx={4}
                            />
                            <SvgText
                                x={x + barWidth / 2}
                                y={height - 5}
                                fontSize="12"
                                fill={textColor}
                                textAnchor="middle"
                            >
                                {labels[index]}
                            </SvgText>
                        </React.Fragment>
                    );
                })}
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        marginBottom: 35
    },
});

export default BarGraph;