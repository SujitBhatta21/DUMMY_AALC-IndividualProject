
interface Choice {
    label: string;
    feedback: string;
    nextNodeId: number | null;  // null for puzzle complete
}

interface DecisionNode {
    id: number;
    text: string;
    choices: Choice[];
}

const nodes: Record<number, DecisionNode> = {
    1: {
        id: 1,
        text: "It's 1976. You're a student in London and you've just heard about apartheid in South Africa for the first time. What do you do?",
        choices: [
            {
                label: "Ignore it? it's happening far away and doesn't affect you.",
                feedback: "You walk away. But the next day, you see a poster on your university wall about apartheid. You can't ignore it anymore.",
                nextNodeId: 1,
            },
            {
                label: "Tell your friends what you heard.",
                feedback: "Your friends are shocked. Together, you decide to find out more.",
                nextNodeId: 2,
            },
        ],
    },
    2: {
        id: 2,
        text: "Your friends are shocked. Now what?",
        choices: [
            {
                label: "Organise a meeting to learn more.",
                feedback: "Great choice - you gather a group and start researching what's really happening in South Africa.",
                nextNodeId: 3,
            },
            {
                label: "Post about it on the university noticeboard.",
                feedback: "Also a great choice - other students start asking questions and wanting to help.",
                nextNodeId: 3,
            },
        ],
    },
    3: {
        id: 3,
        text: "You find out Barclays Bank invests money in apartheid South Africa. What do you do?",
        choices: [
            {
                label: "Close your Barclays bank account and tell others to do the same.",
                feedback: "You took action! Thousands of students did exactly this. The boycott became one of the most effective anti-apartheid campaigns in Britain.",
                nextNodeId: null,
            },
            {
                label: "Write to your local MP demanding action.",
                feedback: "Great move — political pressure mattered too. MPs began raising apartheid in Parliament, increasing pressure on the government.",
                nextNodeId: null,
            },
            {
                label: "Do nothing - it's just a bank.",
                feedback: "Without pressure, companies keep profiting from apartheid. Every voice matters.",
                nextNodeId: 3,
            },
        ],
    },
};


function DecisionTree() {

    return (
        <div>

        </div>
    );
}

export default DecisionTree;