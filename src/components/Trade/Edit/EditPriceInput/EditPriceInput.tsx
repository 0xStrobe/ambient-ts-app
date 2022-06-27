import styles from './EditPriceInput.module.css';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { ChangeEvent } from 'react';

interface EditPriceInputProps {
    disable?: boolean;
    fieldId: string | number;
    title: string;
    percentageDifference: number;
    value: string;
    handleChangeEvent: (evt: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    increaseTick: () => void;
    decreaseTick: () => void;
}

export default function EditPriceInput(props: EditPriceInputProps) {
    const {
        disable,
        fieldId,
        title,
        percentageDifference,
        value,
        onBlur,
        increaseTick,
        decreaseTick,
        handleChangeEvent,
    } = props;

    const convertedValue = parseFloat(value);

    const priceInput = (
        <input
            id={`${fieldId}-price-input-quantity`}
            className={styles.price_quantity}
            type='text'
            onChange={(event) => handleChangeEvent(event)}
            onBlur={() => onBlur()}
            inputMode='decimal'
            autoComplete='off'
            autoCorrect='off'
            min='0'
            minLength={1}
            pattern='^[0-9]*[.,]?[0-9]*$'
            placeholder='0.00'
            disabled={disable}
            required
            defaultValue={convertedValue}
        />
    );
    //  Juniors notes:
    // Currently I am accessing the decreaseTick and increaseTick as props from EditMinMaxPrice, which is the same workflow as adding a new position.

    // I don't think we need all of that here. We could simply retrieve the tick in this component and increase or decrease the default value(from the position) by the tick when the user clicks the plus or minus icon. We can also do something similar witht he onChange

    // Once we change the value, we simply dispatch it as the new values.

    return (
        <div className={styles.minMax_container}>
            <span className={styles.title}>{title}</span>
            <div className={styles.price_input_container}>
                <span className={styles.sign} onClick={decreaseTick}>
                    <FaMinus size={16} />
                </span>
                <span>{priceInput}</span>
                <span className={styles.sign} onClick={increaseTick}>
                    <FaPlus size={16} />
                </span>
            </div>
            <span className={styles.percentage}>{percentageDifference}% difference</span>
        </div>
    );
}
