import type {ReactNode} from "react";

const shardContent: Record<number, ReactNode> = {
    1: (
        <div>
            <p>
                Apartheid is a system of racial segregation and control.
                The word apartheid means <strong>'separateness'</strong>.
            </p>
            <p>
                In the 17th Century, Dutch settlers arrived in South Africa,
                followed by the British in the 18th Century.
            </p>
            <p>
                Colonial rivals, they stole the land and took away rights
                from the people who already lived there.
            </p>
            <p>
                The National Party, a white minority political party, began to put
                'Apartheid' laws in place after they took power in <strong>1948</strong> following
                an election in which only white people could vote. These laws controlled where
                black South Africans could live, work, and move.
            </p>
            <p>
                On the left, you see the National Party flag.
                On the right, the ANC (African National Congress) flag —
                one of the organisations that resisted apartheid and who had a base in Penton Street.
            </p>
        </div>
    ),
    2: <p>Shard 2 content</p>,
    3: <p>Shard 3 content</p>,
    4: <p>Shard 4 content</p>,
    5: <p>Shard 5 content</p>,
    6: <p>Shard 6 content</p>,
    7: <p>Shard 7 content</p>,
    8: <p>Shard 8 content</p>,
    9: <p>Shard 9 content</p>,
};

export default shardContent;