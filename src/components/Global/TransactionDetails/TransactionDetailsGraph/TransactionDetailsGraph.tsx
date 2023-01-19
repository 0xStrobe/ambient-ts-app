import * as d3 from 'd3';
import * as d3fc from 'd3fc';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import { memoizeFetchTransactionGraphData } from '../../../../App/functions/fetchTransactionDetailsGraphData';
import { useAppChain } from '../../../../App/hooks/useAppChain';
import { useAppSelector } from '../../../../utils/hooks/reduxToolkit';
import { ITransaction } from '../../../../utils/state/graphDataSlice';

import './TransactionDetailsGraph.css';

interface TransactionDetailsGraphIF {
    tx: ITransaction;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function TransactionDetailsGraph(props: TransactionDetailsGraphIF) {
    const { tx } = props;

    const isServerEnabled =
        process.env.REACT_APP_CACHE_SERVER_IS_ENABLED !== undefined
            ? process.env.REACT_APP_CACHE_SERVER_IS_ENABLED === 'true'
            : true;

    const tradeData = useAppSelector((state) => state.tradeData);

    const baseTokenAddress = tradeData.baseToken.address;
    const quoteTokenAddress = tradeData.quoteToken.address;

    const mainnetBaseTokenAddress = tradeData.mainnetBaseTokenAddress;
    const mainnetQuoteTokenAddress = tradeData.mainnetQuoteTokenAddress;

    const { isConnected } = useAccount();

    const isUserLoggedIn = isConnected;
    const [chainData] = useAppChain('0x5', isUserLoggedIn);

    const fetchGraphData = memoizeFetchTransactionGraphData();

    const [graphData, setGraphData] = useState();

    const d3PlotGraph = useRef(null);
    const d3Yaxis = useRef(null);
    const d3Xaxis = useRef(null);
    const graphMainDiv = useRef(null);

    const [scaleData, setScaleData] = useState<any>();
    const [lineSeries, setLineSeries] = useState<any>();
    const [priceLine, setPriceLine] = useState();

    useEffect(() => {
        (async () => {
            console.log({ tx });
            if (graphData === undefined) {
                const fetchEnabled = !!(
                    isServerEnabled &&
                    baseTokenAddress &&
                    quoteTokenAddress &&
                    mainnetBaseTokenAddress &&
                    mainnetQuoteTokenAddress
                );

                try {
                    const graphData = await fetchGraphData(
                        fetchEnabled,
                        mainnetBaseTokenAddress,
                        mainnetQuoteTokenAddress,
                        chainData,
                        3600,
                        baseTokenAddress,
                        quoteTokenAddress,
                    );

                    if (graphData) {
                        setGraphData(() => {
                            return graphData.candles;
                        });
                    } else {
                        setGraphData(() => {
                            return undefined;
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        })();
    }, []);

    useEffect(() => {
        if (scaleData !== undefined) {
            const lineSeries = d3fc
                .seriesSvgLine()
                .xScale(scaleData.xScale)
                .yScale(scaleData.yScale)
                .crossValue((d: any) => d.time * 1000)
                .mainValue((d: any) => d.invPriceCloseExclMEVDecimalCorrected)
                .decorate((selection: any) => {
                    selection.enter().style('stroke', '#7371FC');
                });

            setLineSeries(() => {
                return lineSeries;
            });

            const priceLine = d3fc
                .annotationSvgLine()
                .value((d: any) => d)
                .xScale(scaleData.xScale)
                .yScale(scaleData.yScale);

            priceLine.decorate((selection: any) => {
                selection.enter().select('g.right-handle').remove();
                selection.enter().select('line').attr('class', 'priceLine');
                selection.select('g.left-handle').remove();
            });

            setPriceLine(() => {
                return priceLine;
            });
        }
    }, [scaleData]);

    useEffect(() => {
        if (graphData !== undefined) {
            const diff = new Date().getTime() - tx.time * 1000;
            const endBoundary = new Date(tx.time * 1000 + diff);
            const startBoundary = new Date(tx.time * 1000 - diff);

            console.log(endBoundary, new Date(tx.time * 1000), startBoundary);

            const yExtent = d3fc
                .extentLinear()
                .accessors([(d: any) => d.invPriceCloseExclMEVDecimalCorrected])
                .pad([0, 0.1]);

            const xExtent = d3fc.extentDate().accessors([(d: any) => d.time * 1000]);

            const xScale = d3.scaleTime();
            const yScale = d3.scaleLinear();

            xScale.domain(xExtent(graphData));
            yScale.domain(yExtent(graphData));

            const xScaleOriginal = xScale.copy();

            const yAxis = d3fc.axisRight().scale(yScale).ticks(5);

            const scaleData = {
                xScale: xScale,
                yScale: yScale,
                xScaleOriginal: xScaleOriginal,
                yAxis: yAxis,
            };

            setScaleData(() => {
                return scaleData;
            });
        }
    }, [tx, graphData]);

    const render = useCallback(() => {
        const nd = d3.select('#d3PlotGraph').node() as any;
        nd.requestRedraw();
    }, []);

    useEffect(() => {
        if (
            graphData !== undefined &&
            scaleData !== undefined &&
            lineSeries !== undefined &&
            priceLine !== undefined
        ) {
            drawChart(graphData, scaleData, lineSeries, priceLine);
        }
    }, [scaleData, lineSeries, priceLine, graphData]);

    const drawChart = useCallback(
        (graphData: any, scaleData: any, lineSeries: any, priceLine: any) => {
            if (graphData.length > 0) {
                const xAxis = d3fc.axisBottom().scale(scaleData.xScale).ticks(3);

                const priceJoin = d3fc.dataJoin('g', 'priceJoin');
                const lineJoin = d3fc.dataJoin('g', 'lineJoin');

                d3.select(d3PlotGraph.current).on('measure', function (event: any) {
                    scaleData.xScale.range([0, event.detail.width]);
                    scaleData.xScaleOriginal.range([0, event.detail.width]);
                    scaleData.yScale.range([event.detail.height, 0]);
                });

                d3.select(d3PlotGraph.current).on('measure.range', function (event: any) {
                    const svg = d3.select(event.target).select('svg');

                    const zoom = d3.zoom().on('zoom', (event: any) => {
                        if (event.sourceEvent.type === 'wheel') {
                            scaleData.xScale.domain(
                                event.transform.rescaleX(scaleData.xScaleOriginal).domain(),
                            );
                        } else {
                            const domainX = scaleData.xScale.domain();
                            const linearX = d3
                                .scaleTime()
                                .domain(scaleData.xScale.range())
                                .range([0, domainX[1] - domainX[0]]);

                            const deltaX = linearX(-event.sourceEvent.movementX);
                            scaleData.xScale.domain([
                                new Date(domainX[0].getTime() + deltaX),
                                new Date(domainX[1].getTime() + deltaX),
                            ]);
                        }

                        render();
                    }) as any;

                    svg.call(zoom);
                });

                d3.select(d3PlotGraph.current).on('draw', function (event: any) {
                    const svg = d3.select(event.target).select('svg');
                    priceJoin(svg, [[tx.invPriceDecimalCorrected]]).call(priceLine);
                    lineJoin(svg, [graphData]).call(lineSeries);

                    d3.select(d3Yaxis.current).select('svg').call(scaleData.yAxis);
                    d3.select(d3Xaxis.current).select('svg').call(xAxis);
                });

                render();
            }
        },
        [tx],
    );

    return (
        <div
            className='main_layout_chart'
            ref={graphMainDiv}
            id='tvl_chart'
            data-testid={'chart'}
            style={{
                height: '100%',
                width: '100%',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    height: '90%',
                    width: '100%',
                }}
            >
                <d3fc-svg
                    id='d3PlotGraph'
                    ref={d3PlotGraph}
                    style={{ height: '300px', width: '90%' }}
                ></d3fc-svg>
                <d3fc-svg className='y-axis' ref={d3Yaxis} style={{ width: '10%' }}></d3fc-svg>
            </div>
            <d3fc-svg
                className='x-axis'
                ref={d3Xaxis}
                style={{ height: '20px', width: '100%' }}
            ></d3fc-svg>
        </div>
    );
}
