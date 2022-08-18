/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from 'dayjs';
import { DetailedHTMLProps, HTMLAttributes, useState } from 'react';
import { useParams } from 'react-router';
import AreaChart from '../../../components/Global/Charts/AreaChart';
import BarChart from '../../../components/Global/Charts/BarChart';
import { PoolData } from '../../../state/pools/models';
import { formatDollarAmount } from '../../../utils/numbers';
import LiquidityChart from '../LiquidtiyChart/LiquidityChart';
import styles from './PoolPageChart.module.css';

interface PoolPageChartProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tvlData?: any;
    feesData?: any;
    volumeData?: any;
    pool?: PoolData;
    valueLabel?: string | undefined;
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            'd3fc-group': DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
            'd3fc-svg': DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
        }
    }
}

export default function PoolPageChart(props: PoolPageChartProps) {
    const { address } = useParams() ?? '';
    const [activeTab, setActiveTab] = useState('vlm');
    const tabData = [
        { title: 'Volume', id: 'vlm' },
        { title: 'TVL', id: 'tvl' },
        { title: 'Liquidity', id: 'liq' },
        { title: 'Fees', id: 'fee' },
    ];
    const [latestValue, setLatestValue] = useState<number | undefined>();
    const [valueLabel, setValueLabel] = useState<string | undefined>();

    return (
        <div className={styles.cqwlBw}>
            <div className={styles.jnaQPQ}>
                <div className={styles.ktegKV}>
                    <label className={styles.eJnjNO}>
                        {latestValue
                            ? activeTab === 'vlm' || activeTab === 'fee'
                                ? latestValue
                                : activeTab === 'liq'
                                ? null
                                : formatDollarAmount(latestValue, 2)
                            : formatDollarAmount(props.pool?.volumeUSD, 2)}
                    </label>
                    <label className={styles.v4m1wv}>
                        {valueLabel
                            ? activeTab === 'vlm'
                                ? valueLabel
                                : activeTab === 'liq'
                                ? null
                                : valueLabel + ' (UTC) '
                            : dayjs.utc().format('MMM D, YYYY')}
                    </label>
                </div>
                <div className={styles.settings_container}>
                    {tabData.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                            }}
                            style={
                                activeTab === tab.id
                                    ? { background: '#4169E1' }
                                    : { background: 'var(--dark1)' }
                            }
                        >
                            {tab.title}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'tvl' ? (
                <AreaChart
                    data={props.tvlData}
                    value={latestValue}
                    label={valueLabel}
                    setValue={setLatestValue}
                    setLabel={setValueLabel}
                />
            ) : activeTab === 'liq' ? (
                <LiquidityChart
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    address={address!}
                    value={latestValue}
                    label={valueLabel}
                />
            ) : (
                <BarChart
                    data={activeTab === 'vlm' ? props.volumeData : props.feesData}
                    value={latestValue}
                    label={valueLabel}
                    setValue={setLatestValue}
                    setLabel={setValueLabel}
                    snapType={'days'}
                />
            )}
        </div>
    );
}