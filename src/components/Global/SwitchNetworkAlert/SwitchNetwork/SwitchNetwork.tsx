// START: Import React and Dongles
import { RiErrorWarningLine } from 'react-icons/ri';

// START: Import Local Files
import styles from './SwitchNetwork.module.css';
import NetworkButtons from '../NetworkButton/NetworkButtons';

interface SwitchNetworkPropsIF {
    switchNetworkInMoralis: (providedChainId: string) => Promise<void>;
}

export default function SwitchNetwork(props: SwitchNetworkPropsIF) {
    const { switchNetworkInMoralis } = props;

    return (
        <div className={styles.outside_modal}>
            <div className={styles.modal}>
                <header className={styles.modal_header}>
                    <RiErrorWarningLine size={20} color='#ffffff' />
                    <h2>Unsupported Network</h2>
                </header>
                <section className={styles.modal_content}>
                    <span className={styles.content_title}>Please choose a network below</span>
                    <NetworkButtons switchNetworkInMoralis={switchNetworkInMoralis} />
                </section>
            </div>
        </div>
    );
}