import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Line, Polyline, Circle, Text as SvgText } from 'react-native-svg';
import { colors, typography } from '../shared/theme';

interface LineGraphProps {
    lineName: string;
    data: {
        labels: string[];
        datasets: {
            data: number[];
            color: (opacity?: number) => string;
            strokeWidth: number;
        }[];
    };
    width: number;
    height?: number;
}

const LineGraph: React.FC<LineGraphProps> = ({
    lineName,
    data,
    width,
    height = 200,
}) => {
    const { labels } = data;
    const values = data.datasets[0].data;
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const numPoints = values.length;
    const textColor = '#fff'; // White text for dark background

    // Use a 5-unit step for the grid
    const stepSize = 5;
    // Round down the minimum value to the nearest 5
    const baseline = Math.floor(minValue / stepSize) * stepSize;
    // Round up the maximum value to the nearest 5
    const gridMax = Math.ceil(maxValue / stepSize) * stepSize;
    const range = gridMax - baseline;

    // Define paddings
    const topPadding = 20;
    const bottomPadding = 40; // increased to provide more room at the bottom for labels
    const leftMargin = 20; // Space for Y-axis labels
    const rightMargin = 20;
    const graphStart = leftMargin+20;
    const availableWidth = width - graphStart - rightMargin;
    const interval = numPoints > 1 ? availableWidth / (numPoints - 1) : 0;

    // Map a value to a y coordinate using the new baseline and the defined paddings
    const getYPosition = (value: number) => {
        if (range === 0) return height - bottomPadding;
        return topPadding + ((gridMax - value) / range) * (height - topPadding - bottomPadding);
    };

    // Generate grid steps starting from baseline+stepSize (hiding the lowest one)
    const getGridSteps = () => {
        const steps = [];
        for (let step = baseline ; step <= gridMax; step += stepSize) {
            steps.push(step);
        }
        return steps;
    };

    return (
        <View style={[styles.container, { width, height }]}>
            <Text style={[typography.subtitle, {marginBottom: 10, color: colors.text}]}>
                {lineName}
            </Text>
            <Svg width={width} height={height}>
                {/* Horizontal grid lines */}
                {getGridSteps().map((step, i) => {
                    const y = getYPosition(step);
                    return (
                        <React.Fragment key={i}>
                            <Line
                                x1={leftMargin}
                                y1={y}
                                x2={width - rightMargin}
                                y2={y}
                                stroke="#333"
                                strokeWidth={0.5}
                            />
                            <SvgText
                                x={leftMargin}
                                y={y}
                                fontSize="12"
                                fill={textColor}
                                alignmentBaseline="middle"
                                textAnchor="end"
                            >
                                {step}
                            </SvgText>
                        </React.Fragment>
                    );
                })}

                {/* Data line */}
                <Polyline
                    points={values.map((v, i) => {
                        const x = graphStart + i * interval;
                        const y = getYPosition(v);
                        return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke={data.datasets[0].color(1)}
                    strokeWidth={data.datasets[0].strokeWidth}
                />

                {/* Data points and X-axis labels */}
                {values.map((v, i) => {
                    const x = graphStart + i * interval;
                    const y = getYPosition(v);
                    return (
                        <React.Fragment key={i}>
                            <Circle
                                cx={x}
                                cy={y}
                                r={4}
                                fill={data.datasets[0].color(1)}
                            />
                            <SvgText
                                x={x}
                                y={height - 5} // position labels below the graph area
                                fontSize="12"
                                fill={textColor}
                                textAnchor="middle"
                            >
                                {labels[i]}
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

export default LineGraph;
