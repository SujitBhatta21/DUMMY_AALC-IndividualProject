interface OrderEventsProps {
    onComplete?: () => void;
    rewardsText?: string;
}

const events : Record<number, string> = {
    1 : "First",
    2 : "Second",
    3 : "Third"
}

function OrderEventsChronological ({ onComplete, rewardsText }: OrderEventsProps) {
    return (
        <div>

        </div>
    );
}

export default OrderEventsChronological;