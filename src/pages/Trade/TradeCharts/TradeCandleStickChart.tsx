import { DetailedHTMLProps, HTMLAttributes, useEffect, useMemo, useState } from 'react';
import { CandleData, CandlesByPoolAndDuration } from '../../../utils/state/graphDataSlice';
import { targetData } from '../../../utils/state/tradeDataSlice';
import Chart from '../../Chart/Chart';
import './TradeCandleStickChart.css';
import logo from '../../../assets/images/logos/ambient_logo.svg';
import { CandleChartData, LiquidityData } from './TradeCharts';
import { useAppSelector } from '../../../utils/hooks/reduxToolkit';

/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            'd3fc-group': DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
            'd3fc-svg': DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
        }
    }
}

interface ChartData {
    tvlData: any[];
    volumeData: any[];
    feeData: any[];
    priceData: CandlesByPoolAndDuration | undefined;
    changeState: (isOpen: boolean | undefined, candleData: CandleData | undefined) => void;
    chartItemStates: chartItemStates;
    denomInBase: boolean;
    targetData: targetData[] | undefined;
    limitPrice: string | undefined;
    setLimitRate: React.Dispatch<React.SetStateAction<string>>;
    limitRate: string;
    liquidityData: any;
    isAdvancedModeActive: boolean | undefined;
    simpleRangeWidth: number | undefined;
    pinnedMinPriceDisplayTruncated: number | undefined;
    pinnedMaxPriceDisplayTruncated: number | undefined;
    truncatedPoolPrice: number | undefined;
    spotPriceDisplay: string | undefined;
    setCurrentData: React.Dispatch<React.SetStateAction<CandleChartData | undefined>>;
    upBodyColor: string;
    upBorderColor: string;
    downBodyColor: string;
    downBorderColor: string;
}

interface ChartUtils {
    period: any;
    chartData: CandleChartData[];
}

type chartItemStates = {
    showTvl: boolean;
    showVolume: boolean;
    showFeeRate: boolean;
};

export default function TradeCandleStickChart(props: ChartData) {
    const data = {
        tvlData: props.tvlData,
        volumeData: props.volumeData,
        feeData: props.feeData,
        priceData: props.priceData,
        liquidityData: props.liquidityData,
    };

    const { denomInBase } = props;

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [parsedChartData, setParsedChartData] = useState<ChartUtils | undefined>(undefined);

    const tradeData = useAppSelector((state) => state.tradeData);
    const activeChartPeriod = tradeData.activeChartPeriod;

    // Parse price data
    useEffect(() => {
        setIsLoading(true);
        const chartData: CandleChartData[] = [];
        props.priceData?.candles.map((data) => {
            chartData.push({
                date: new Date(data.time * 1000),
                open: denomInBase
                    ? data.invPriceOpenExclMEVDecimalCorrected
                    : data.priceOpenExclMEVDecimalCorrected,
                close: denomInBase
                    ? data.invPriceCloseExclMEVDecimalCorrected
                    : data.priceCloseExclMEVDecimalCorrected,
                high: denomInBase
                    ? data.invMinPriceExclMEVDecimalCorrected
                    : data.maxPriceExclMEVDecimalCorrected,
                low: denomInBase
                    ? data.invMaxPriceExclMEVDecimalCorrected
                    : data.minPriceExclMEVDecimalCorrected,
                time: data.time,
                allSwaps: [],
            });
        });

        const chartUtils: ChartUtils = {
            period: props.priceData?.duration,
            chartData: chartData,
        };
        setParsedChartData(() => {
            return chartUtils;
        });
    }, [props.priceData, activeChartPeriod, denomInBase]);

    // Parse liquidtiy data
    const liquiditiyData = useMemo(() => {
        const liqData: LiquidityData[] = [];

        props.liquidityData.ranges.map((data: any) => {
            liqData.push({
                activeLiq: data.activeLiq,
                upperBoundPriceDecimalCorrected: denomInBase
                    ? data.upperBoundInvPriceDecimalCorrected
                    : data.upperBoundInvPriceDecimalCorrected,
            });
        });

        return liqData;
    }, [props.liquidityData, denomInBase]);

    const loading = (
        <div className='animatedImg'>
            <img src={logo} width={110} alt='logo' />
        </div>
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log({ parsedChartData });
            setIsLoading(parsedChartData === undefined || parsedChartData.chartData.length === 0);
        }, 1000);
        return () => clearTimeout(timer);
    }, [parsedChartData?.chartData]);

    return (
        <>
            <div style={{ height: '100%', width: '100%' }}>
                {!isLoading ? (
                    <Chart
                        priceData={parsedChartData}
                        liquidityData={liquiditiyData}
                        changeState={props.changeState}
                        targetData={props.targetData}
                        limitPrice={props.limitPrice}
                        setLimitRate={props.setLimitRate}
                        limitRate={props.limitRate}
                        denomInBase={props.denomInBase}
                        isAdvancedModeActive={props.isAdvancedModeActive}
                        simpleRangeWidth={props.simpleRangeWidth}
                        pinnedMinPriceDisplayTruncated={props.pinnedMinPriceDisplayTruncated}
                        pinnedMaxPriceDisplayTruncated={props.pinnedMaxPriceDisplayTruncated}
                        spotPriceDisplay={props.spotPriceDisplay}
                        truncatedPoolPrice={props.truncatedPoolPrice}
                        feeData={data.feeData}
                        volumeData={data.volumeData}
                        tvlData={data.tvlData}
                        chartItemStates={props.chartItemStates}
                        setCurrentData={props.setCurrentData}
                        upBodyColor={props.upBodyColor}
                        upBorderColor={props.upBorderColor}
                        downBodyColor={props.downBodyColor}
                        downBorderColor={props.downBorderColor}
                    />
                ) : (
                    <>{loading}</>
                )}
            </div>
        </>
    );
}
